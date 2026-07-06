import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { RedisService } from '../redis/redis.service'

@ApiTags('health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: "État de santé de l'API (base de données, cache)" })
  async check() {
    const [database, redis] = await Promise.all([this.checkDatabase(), this.redis.ping()])
    const ok = database && redis

    return {
      status: ok ? 'ok' : 'degraded',
      checks: {
        database: database ? 'up' : 'down',
        redis: redis ? 'up' : 'down',
      },
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    }
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1')
      return true
    } catch {
      return false
    }
  }
}
