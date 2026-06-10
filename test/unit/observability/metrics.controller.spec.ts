import { MetricsController } from '../../../src/observability/metrics.controller';
import { MetricsService } from '../../../src/observability/metrics.service';

describe('MetricsController', () => {
  it('should return metrics content from the metrics service', async () => {
    const metricsService = {
      getMetrics: jest.fn().mockResolvedValue('requests_total 1'),
    } as unknown as MetricsService;
    const controller = new MetricsController(metricsService);

    await expect(controller.getMetrics()).resolves.toBe('requests_total 1');
    expect(metricsService.getMetrics).toHaveBeenCalledTimes(1);
  });
});
