import 'dotenv/config'
import { DataSource } from 'typeorm'

/**
 * DataSource dédiée à la CLI TypeORM (génération et exécution des migrations).
 * Distincte de la configuration runtime (TypeOrmModule dans app.module) :
 * ici synchronize est toujours désactivé — c'est le rôle des migrations.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'tracknshare',
  password: process.env.DB_PASSWORD ?? 'tracknshare',
  database: process.env.DB_NAME ?? 'tracknshare',
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
})
