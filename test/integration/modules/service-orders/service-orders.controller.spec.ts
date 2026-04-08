import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ServiceOrdersController } from '../../../../src/modules/service-orders/interfaces/http/controllers/service-orders.controller';
import { CreateServiceOrderUseCase } from '../../../../src/modules/service-orders/application/use-cases/create-service-order.use-case';
import { GetServiceOrderUseCase } from '../../../../src/modules/service-orders/application/use-cases/get-service-order.use-case';
import { RegisterDiagnosisUseCase } from '../../../../src/modules/service-orders/application/use-cases/register-diagnosis.use-case';
import { SendBudgetForApprovalUseCase } from '../../../../src/modules/service-orders/application/use-cases/send-budget-for-approval.use-case';
import { StartServiceOrderExecutionUseCase } from '../../../../src/modules/service-orders/application/use-cases/start-service-order-execution.use-case';
import { FinishServiceOrderUseCase } from '../../../../src/modules/service-orders/application/use-cases/finish-service-order.use-case';
import { DeliverServiceOrderUseCase } from '../../../../src/modules/service-orders/application/use-cases/deliver-service-order.use-case';
import { AddServiceToServiceOrderUseCase } from '../../../../src/modules/service-orders/application/use-cases/add-service-to-service-order.use-case';
import { AddStockItemToServiceOrderUseCase } from '../../../../src/modules/service-orders/application/use-cases/add-stock-item-to-service-order.use-case';

describe('ServiceOrdersController (integration)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ServiceOrdersController],
            providers: [
                { provide: CreateServiceOrderUseCase, useValue: { execute: jest.fn().mockResolvedValue({ id: 'service-order-1' }) } },
                {
                    provide: GetServiceOrderUseCase, useValue: {
                        execute: jest.fn().mockResolvedValue({
                            id: 'service-order-1',
                            customerId: 'customer-1',
                            vehicleId: 'vehicle-1',
                            status: 'RECEIVED',
                            diagnosis: null,
                            servicesAmount: 150,
                            stockItemsAmount: 400,
                            totalAmount: 550,
                            createdAt: new Date(),
                            startedAt: null,
                            finishedAt: null,
                            deliveredAt: null,
                            updatedAt: new Date(),
                            services: [
                                {
                                    id: 'item-1',
                                    serviceId: 'service-1',
                                    name: 'Troca de óleo',
                                    quantity: 1,
                                    unitPrice: 150,
                                    totalPrice: 150,
                                },
                            ],
                            stockItems: [
                                {
                                    id: 'item-2',
                                    stockItemId: 'stock-1',
                                    name: 'Pastilha de freio',
                                    quantity: 2,
                                    unitPrice: 200,
                                    totalPrice: 400,
                                },
                            ],
                        })
                    }
                },
                { provide: RegisterDiagnosisUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
                { provide: SendBudgetForApprovalUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
                { provide: StartServiceOrderExecutionUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
                { provide: FinishServiceOrderUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
                { provide: DeliverServiceOrderUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
                { provide: AddServiceToServiceOrderUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
                { provide: AddStockItemToServiceOrderUseCase, useValue: { execute: jest.fn().mockResolvedValue(undefined) } },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('GET /service-orders/:id should return service order details with items', async () => {
        await request(app.getHttpServer())
            .get('/service-orders/service-order-1')
            .expect(200)
            .expect(({ body }) => {
                expect(body.id).toBe('service-order-1');
                expect(body.services).toHaveLength(1);
                expect(body.stockItems).toHaveLength(1);
                expect(body.totalAmount).toBe(550);
            });
    });
});