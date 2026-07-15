import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, of, tap } from 'rxjs'
import { RedisService } from '../../redis/redis.service'

const HTTP_CACHE_TTL = 30 // seconds

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<{ method: string; url: string }>()

    // Only cache GET requests
    if (req.method !== 'GET') return next.handle()

    const cacheKey = `http:${req.url}`
    const cached = await this.redis.get(cacheKey)
    if (cached !== null) return of(cached)

    return next.handle().pipe(
      tap((response) => {
        // Fire-and-forget: a cache write failure must not break the response
        void this.redis.set(cacheKey, response, HTTP_CACHE_TTL)
      }),
    )
  }
}
