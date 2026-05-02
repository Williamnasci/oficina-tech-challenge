import { Module } from '@nestjs/common';
import { CreateServiceOrderUseCase } from './application/use-cases/create-service-order.use-case';
import { DeliverServiceOrderUseCase } from './application/use-cases/deliver-service-order.use-case';
import { FinishServiceOrderUseCase } from './application/use-cases/finish-service-order.use-case';
import { GetServiceOrderUseCase } from './application/use-cases/get-service-order.use-case';
import { RegisterDiagnosisUseCase } from './application/use-cases/register-diagnosis.use-case';
import { SendBudgetForApprovalUseCase } from './application/use-cases/send-budget-for-approval.use-case';
import { StartServiceOrderExecutionUseCase } from './application/use-cases/start-service-order-execution.use-case';
import { AddServiceToServiceOrderUseCase } from './application/use-cases/add-service-to-service-order.use-case';
import { AddStockItemToServiceOrderUseCase } from './application/use-cases/add-stock-item-to-service-order.use-case';
import { ApproveBudgetUseCase } from './application/use-cases/approve-budget.use-case';
import { FindServiceOrdersByDocumentUseCase } from './application/use-cases/find-service-orders-by-document.use-case';
import { ServiceOrderRepository } from './domain/repositories/service-order.repository';
import { PrismaServiceOrderRepository } from './infrastructure/repositories/prisma-service-order.repository';
import { ServiceOrdersController } from './interfaces/http/controllers/service-orders.controller';
import { CustomersModule } from '../customers/customers.module';

@Module({
    imports: [CustomersModule],
    controllers: [ServiceOrdersController],
    providers: [
        AddServiceToServiceOrderUseCase,
        CreateServiceOrderUseCase,
        GetServiceOrderUseCase,
        RegisterDiagnosisUseCase,
        SendBudgetForApprovalUseCase,
        StartServiceOrderExecutionUseCase,
        FinishServiceOrderUseCase,
        DeliverServiceOrderUseCase,
        AddStockItemToServiceOrderUseCase,
        ApproveBudgetUseCase,
        FindServiceOrdersByDocumentUseCase,
        {
            provide: ServiceOrderRepository,
            useClass: PrismaServiceOrderRepository,
        },
    ],
    exports: [ServiceOrderRepository],
})
export class ServiceOrdersModule { }