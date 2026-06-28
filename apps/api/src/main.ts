import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { IoAdapter } from '@nestjs/platform-socket.io'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useWebSocketAdapter(new IoAdapter(app))

  // En-têtes HTTP de sécurité. CSP désactivée pour ne pas bloquer Swagger UI.
  app.use(helmet({ contentSecurityPolicy: false }))

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // Origines explicitement autorisées (prod) via CORS_ORIGIN (séparées par des virgules).
  const explicitOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  app.enableCors({
    origin: (origin, callback) => {
      // Pas d'Origin (curl, Postman, same-origin) -> autorisé.
      if (!origin) return callback(null, true)
      // En dev, toute origine localhost / 127.0.0.1 (n'importe quel port) est acceptée.
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      callback(null, isLocalhost || explicitOrigins.includes(origin))
    },
    credentials: true,
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Track'N Share API")
    .setDescription('Documentation MVP')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
