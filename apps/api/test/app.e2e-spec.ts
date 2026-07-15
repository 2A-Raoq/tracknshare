import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from './../src/app.module'
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter'

/**
 * Tests end-to-end du parcours critique (preuves RNCP BC03-7 / BC01-5).
 *
 * Couvre trois exigences fortes du dossier :
 *  1. Parcours d'authentification nominal (register -> login -> route protégée).
 *  2. Sécurité : un non-membre ne peut PAS accéder au chat/à une équipe (403),
 *     et un anonyme est rejeté (401).
 *  3. RGPD (droit à l'oubli) : après suppression du compte, la reconnexion
 *     échoue (401) — les données ne sont plus exploitables.
 *
 * Nécessite une base PostgreSQL accessible (variables DB_*). Redis est
 * facultatif (dégradation gracieuse du cache). Le ThrottlerGuard est neutralisé
 * ici : on teste le métier, pas la limitation de débit (couverte ailleurs).
 */
/** Corps de réponse des endpoints d'authentification (register/login). */
interface AuthResponseBody {
  success: boolean
  data: {
    accessToken: string
    user: { email: string }
  }
}

describe('Parcours critique (e2e)', () => {
  let app: INestApplication<App>
  let http: App

  // Suffixe unique pour éviter les collisions d'email/pseudo entre exécutions
  // (la base est persistante hors CI).
  const run = `${Date.now()}${process.pid}`
  const pwd = 'Passw0rd!e2e'

  const register = (tag: string) =>
    request(http)
      .post('/api/auth/register')
      .send({
        email: `e2e_${tag}_${run}@tracknshare.local`,
        username: `e2e_${tag}_${run}`.slice(0, 30),
        password: pwd,
      })

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Désactive la limitation de débit pour la stabilité des tests.
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile()

    app = moduleFixture.createNestApplication()
    // Réplique la configuration de production (main.ts) utile aux tests.
    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    app.useGlobalFilters(new AllExceptionsFilter())
    await app.init()
    http = app.getHttpServer()
  }, 30000)

  afterAll(async () => {
    await app.close()
  })

  describe('Authentification', () => {
    it('refuse une inscription au payload invalide (400)', async () => {
      await request(http)
        .post('/api/auth/register')
        .send({ email: 'not-an-email', username: 'x', password: '123' })
        .expect(400)
    })

    it('inscrit, connecte et accède à une route protégée', async () => {
      const res = await register('auth').expect(201)
      const body = res.body as AuthResponseBody
      expect(body.success).toBe(true)
      expect(body.data.accessToken).toEqual(expect.any(String))
      const email = body.data.user.email

      const login = await request(http)
        .post('/api/auth/login')
        .send({ email, password: pwd })
        .expect(200)
      const token = (login.body as AuthResponseBody).data.accessToken
      expect(token).toEqual(expect.any(String))

      const me = await request(http)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      expect((me.body as { data?: unknown }).data).toBeDefined()
    })

    it('refuse une connexion aux identifiants invalides (401)', async () => {
      await request(http)
        .post('/api/auth/login')
        .send({ email: `unknown_${run}@tracknshare.local`, password: pwd })
        .expect(401)
    })
  })

  describe("Sécurité — accès au chat d'équipe", () => {
    let teamId: string
    let outsiderToken: string

    beforeAll(async () => {
      // Membre : crée une équipe.
      const owner = await register('owner')
      const ownerToken = (owner.body as AuthResponseBody).data.accessToken
      const team = await request(http)
        .post('/api/teams')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: `Squad ${run}`.slice(0, 30), tag: 'E2E' })
        .expect(201)
      teamId = (team.body as { data: { id: string } }).data.id

      // Étranger : utilisateur authentifié mais NON membre.
      const outsider = await register('outsider')
      outsiderToken = (outsider.body as AuthResponseBody).data.accessToken
    }, 30000)

    it('interdit à un non-membre de lire les messages (403)', async () => {
      await request(http)
        .get(`/api/teams/${teamId}/messages`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(403)
    })

    it("interdit à un non-membre d'envoyer un message (403)", async () => {
      await request(http)
        .post(`/api/teams/${teamId}/messages`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .send({ content: 'intrusion' })
        .expect(403)
    })

    it("interdit à un non-membre de voir le détail de l'équipe (403)", async () => {
      await request(http)
        .get(`/api/teams/${teamId}`)
        .set('Authorization', `Bearer ${outsiderToken}`)
        .expect(403)
    })

    it('rejette un accès anonyme au chat (401)', async () => {
      await request(http).get(`/api/teams/${teamId}/messages`).expect(401)
    })
  })

  describe("RGPD — droit à l'oubli", () => {
    it('supprime le compte puis rend la reconnexion impossible (401)', async () => {
      const res = await register('rgpd').expect(201)
      const { accessToken, user } = (res.body as AuthResponseBody).data

      // Le compte fonctionne avant suppression.
      await request(http)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      // Suppression RGPD.
      await request(http)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204)

      // Les données ne sont plus exploitables : reconnexion refusée.
      await request(http)
        .post('/api/auth/login')
        .send({ email: user.email, password: pwd })
        .expect(401)
    })
  })
})
