import { MetricsService } from '../../../src/observability/metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
  });

  it('should expose Prometheus metrics with custom counters and gauges', async () => {
    service.recordHttpRequest('GET', '/health', 200, 0.01);
    service.setHealthcheckStatus('app', true);
    service.setHealthcheckStatus('database', false);

    const metrics = await service.getMetrics();

    expect(metrics).toContain('requests_total');
    expect(metrics).toContain('request_duration_seconds');
    expect(metrics).toContain('healthcheck_status');
    expect(metrics).toContain('component="app"');
    expect(metrics).toContain('component="database"');
  });

  it('should return the Prometheus content type', () => {
    expect(service.getContentType()).toContain('text/plain');
  });
});
