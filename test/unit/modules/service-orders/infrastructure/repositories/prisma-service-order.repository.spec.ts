import { PrismaServiceOrderRepository } from '../../../../../../src/modules/service-orders/infrastructure/repositories/prisma-service-order.repository';
import { ServiceOrder } from '../../../../../../src/modules/service-orders/domain/entities/service-order.entity';
import { ServiceOrderStatus } from '../../../../../../src/modules/service-orders/domain/enums/service-order-status.enum';

describe('PrismaServiceOrderRepository', () => {
    let repository: PrismaServiceOrderRepository;
    let prisma: any;

    const mockDbOrder = {
        id: '1', customerId: 'c-1', vehicleId: 'v-1',
        status: 'RECEIVED', diagnosis: null,
        servicesAmount: 0, stockItemsAmount: 0, totalAmount: 0,
        createdAt: new Date(), startedAt: null, finishedAt: null,
        deliveredAt: null, updatedAt: new Date(),
    };

    beforeEach(() => {
        prisma = {
            serviceOrder: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
            },
            $transaction: jest.fn(),
        };
        repository = new PrismaServiceOrderRepository(prisma);
    });

    describe('create', () => {
        it('should create a service order', async () => {
            prisma.serviceOrder.create.mockResolvedValue(undefined);
            const order = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1' });
            await expect(repository.create(order)).resolves.not.toThrow();
        });
    });

    describe('findById', () => {
        it('should return order when found', async () => {
            prisma.serviceOrder.findUnique.mockResolvedValue(mockDbOrder);
            const result = await repository.findById('1');
            expect(result).not.toBeNull();
            expect(result!.status).toBe(ServiceOrderStatus.RECEIVED);
        });

        it('should return null when not found', async () => {
            prisma.serviceOrder.findUnique.mockResolvedValue(null);
            const result = await repository.findById('1');
            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return all orders', async () => {
            prisma.serviceOrder.findMany.mockResolvedValue([mockDbOrder]);
            const result = await repository.findAll();
            expect(result).toHaveLength(1);
        });
    });

    describe('findByCustomerId', () => {
        it('should return orders by customer', async () => {
            prisma.serviceOrder.findMany.mockResolvedValue([mockDbOrder]);
            const result = await repository.findByCustomerId('c-1');
            expect(result).toHaveLength(1);
        });
    });

    describe('update', () => {
        it('should update order', async () => {
            prisma.serviceOrder.update.mockResolvedValue(undefined);
            const order = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1' });
            await expect(repository.update(order)).resolves.not.toThrow();
        });
    });

    describe('findDetailsById', () => {
        it('should return order details with items', async () => {
            prisma.serviceOrder.findUnique.mockResolvedValue({
                ...mockDbOrder,
                services: [{
                    id: 's-1', serviceId: 'svc-1', quantity: 1,
                    unitPrice: 100, totalPrice: 100,
                    service: { name: 'Oil Change' },
                }],
                stockItems: [{
                    id: 'si-1', stockItemId: 'stk-1', quantity: 2,
                    unitPrice: 50, totalPrice: 100,
                    stockItem: { name: 'Brake Pad' },
                }],
            });

            const result = await repository.findDetailsById('1');
            expect(result).not.toBeNull();
            expect(result!.services).toHaveLength(1);
            expect(result!.stockItems).toHaveLength(1);
        });

        it('should return null when not found', async () => {
            prisma.serviceOrder.findUnique.mockResolvedValue(null);
            const result = await repository.findDetailsById('1');
            expect(result).toBeNull();
        });
    });
});
