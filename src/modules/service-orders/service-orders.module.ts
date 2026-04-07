import { Module } from '@nestjs/common';
import { CreateServiceOrderUseCase } from './application/use-cases/create-service-order.use-case';
import { DeliverServiceOrderUseCase } from './application/use-cases/deliver-service-order.use-case';
import { FinishServiceOrderUseCase } from './application/use-cases/finish-service-order.use-case';
import { GetServiceOrderUseCase } from './application/use-cases/get-service-order.use-case';
import { RegisterDiagnosisUseCase } from './application/use-cases/register-diagnosis.use-case';
import { SendBudgetForApprovalUseCase } from './application/use-cases/send-budget-for-approval.use-case';
import { StartServiceOrderExecutionUseCase } from './application/use-cases/start-service-order-execution.use-case';
import { ServiceOrderRepository } from './domain/repositories/service-order.repository';
import { PrismaServiceOrderRepository } from './infrastructure/repositories/prisma-service-order.repository';
import { ServiceOrdersController } from './interfaces/http/controllers/service-orders.controller';

@Module({
    controllers: [ServiceOrdersController],
    providers: [
        CreateServiceOrderUseCase,
        GetServiceOrderUseCase,
        RegisterDiagnosisUseCase,
        SendBudgetForApprovalUseCase,
        StartServiceOrderExecutionUseCase,
        FinishServiceOrderUseCase,
        DeliverServiceOrderUseCase,
        {
            provide: ServiceOrderRepository,
            useClass: PrismaServiceOrderRepository,
        },
    ],
    exports: [ServiceOrderRepository],
})
export class ServiceOrdersModule { }