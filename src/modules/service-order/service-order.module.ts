import { Module } from '@nestjs/common';
import { ServiceOrderController } from './presentation/controllers/service-order.controller';
import { CreateServiceOrderUseCase } from './application/use-cases/create-service-order.use-case';
import { ServiceOrderRepository } from './domain/repositories/service-order.repository';
import { PrismaServiceOrderRepository } from './infrastructure/persistence/prisma-service-order.repository';

@Module({
    controllers: [ServiceOrderController],
    providers: [
        CreateServiceOrderUseCase,
        {
            provide: ServiceOrderRepository,
            useClass: PrismaServiceOrderRepository,
        },
    ],
})
export class ServiceOrderModule { }