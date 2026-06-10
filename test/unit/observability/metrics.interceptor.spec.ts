import type { ExecutionContext } from '@nestjs/common';
import { of, throwError, lastValueFrom } from 'rxjs';
import { MetricsInterceptor } from '../../../src/observability/metrics.interceptor';
import { MetricsService } from '../../../src/observability/metrics.service';

const createHttpContext = (statusCode = 200): ExecutionContext =>
  ({
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => ({
        method: 'GET',
        path: '/health',
        route: {
          path: '/health',
        },
      }),
      getResponse: () => ({
        statusCode,
      }),
    }),
  }) as unknown as ExecutionContext;

describe('MetricsInterceptor', () => {
  let metricsService: Pick<MetricsService, 'recordHttpRequest'>;

  beforeEach(() => {
    metricsService = {
      recordHttpRequest: jest.fn(),
    };
  });

  it('should record successful HTTP requests', async () => {
    const interceptor = new MetricsInterceptor(
      metricsService as MetricsService,
    );

    await lastValueFrom(
      interceptor.intercept(createHttpContext(201), {
        handle: () => of({ ok: true }),
      }),
    );

    expect(metricsService.recordHttpRequest).toHaveBeenCalledWith(
      'GET',
      '/health',
      201,
      expect.any(Number),
    );
  });

  it('should record failed HTTP requests with the error status', async () => {
    const interceptor = new MetricsInterceptor(
      metricsService as MetricsService,
    );
    const error = new Error('unauthorized') as Error & {
      getStatus: () => number;
    };
    error.getStatus = () => 401;

    await expect(
      lastValueFrom(
        interceptor.intercept(createHttpContext(), {
          handle: () => throwError(() => error),
        }),
      ),
    ).rejects.toThrow('unauthorized');

    expect(metricsService.recordHttpRequest).toHaveBeenCalledWith(
      'GET',
      '/health',
      401,
      expect.any(Number),
    );
  });
});
