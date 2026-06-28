import { HealthController } from './health.controller'
import type { DataSource } from 'typeorm'
import type { RedisService } from '../redis/redis.service'

function makeController(dbOk: boolean, redisOk: boolean) {
  const dataSource = {
    query: dbOk
      ? jest.fn().mockResolvedValue([{ '?column?': 1 }])
      : jest.fn().mockRejectedValue(new Error('db down')),
  } as unknown as DataSource
  const redis = {
    ping: jest.fn().mockResolvedValue(redisOk),
  } as unknown as RedisService
  return new HealthController(dataSource, redis)
}

describe('HealthController', () => {
  it('renvoie status=ok quand la base et Redis répondent', async () => {
    const res = await makeController(true, true).check()
    expect(res.status).toBe('ok')
    expect(res.checks).toEqual({ database: 'up', redis: 'up' })
  })

  it('renvoie status=degraded si la base est indisponible', async () => {
    const res = await makeController(false, true).check()
    expect(res.status).toBe('degraded')
    expect(res.checks.database).toBe('down')
  })

  it('renvoie status=degraded si Redis est indisponible', async () => {
    const res = await makeController(true, false).check()
    expect(res.status).toBe('degraded')
    expect(res.checks.redis).toBe('down')
  })
})
