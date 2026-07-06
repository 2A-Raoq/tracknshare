import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import type { NextFunction, Request, Response } from 'express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { IoAdapter } from '@nestjs/platform-socket.io'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { getCorsOrigins } from './common/config/cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useWebSocketAdapter(new IoAdapter(app))

  // En-têtes HTTP de sécurité. CSP désactivée pour ne pas bloquer Swagger UI.
  app.use(helmet({ contentSecurityPolicy: false }))

  // Défense en profondeur : les réponses authentifiées ne doivent être mises
  // en cache par aucun intermédiaire (navigateur, service worker, proxy).
  // Seul le leaderboard, public, reste cachable.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.path.includes('/leaderboards')) {
      res.setHeader('Cache-Control', 'no-store')
    }
    next()
  })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // Normalisation des erreurs au format du contrat API (+ champs legacy).
  app.useGlobalFilters(new AllExceptionsFilter())

  // Origines explicitement autorisées (prod) via CORS_ORIGIN (séparées par des virgules).
  const explicitOrigins = getCorsOrigins()

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Pas d'Origin (curl, Postman, same-origin) -> autorisé.
      if (!origin) return callback(null, true)
      // En dev, toute origine localhost / 127.0.0.1 (n'importe quel port) est acceptée.
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      callback(null, isLocalhost || explicitOrigins.includes(origin))
    },
    credentials: true,
  }
  app.enableCors(corsOptions)

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Track'N Share API")
    .setDescription('Documentation MVP')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch((error: unknown) => {
  Logger.error(
    `Échec du démarrage de l'API : ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
    'Bootstrap',
  )
  process.exit(1)
})
