import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './shared/infrastructure/prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API status message', () => {
      expect(appController.getHello()).toBe('Oficina API is running.');
    });
  });

  describe('health', () => {
    it('should return health status', async () => {
      await expect(appController.getHealth()).resolves.toEqual({
        status: 'ok',
        app: 'ok',
        database: 'ok',
        timestamp: expect.any(String),
      });
    });
  });
});
