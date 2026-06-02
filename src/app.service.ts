import { Injectable } from '@nestjs/common';
import { PrismaService } from './shared/infrastructure/prisma/prisma.service';

export type HealthStatus = {
  status: 'ok' | 'error';
  app: 'ok';
  database: 'ok' | 'error';
  timestamp: string;
};

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Oficina API is running.';
  }

  async getHealth(): Promise<HealthStatus> {
    let database: HealthStatus['database'] = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'error';
    }

    return {
      status: database === 'ok' ? 'ok' : 'error',
      app: 'ok',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
