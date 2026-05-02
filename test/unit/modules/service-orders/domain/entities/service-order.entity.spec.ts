import { ServiceOrder } from '../../../../../../src/modules/service-orders/domain/entities/service-order.entity';
import { ServiceOrderStatus } from '../../../../../../src/modules/service-orders/domain/enums/service-order-status.enum';
import { DomainException } from '../../../../../../src/shared/domain/errors/domain.exception';

describe('ServiceOrder Entity - Extended', () => {
    it('should approve budget when WAITING_APPROVAL', () => {
        const order = new ServiceOrder({
            id: '1', customerId: 'c-1', vehicleId: 'v-1',
            status: ServiceOrderStatus.WAITING_APPROVAL,
        });

        order.approveBudget();
        expect(order.status).toBe(ServiceOrderStatus.IN_PROGRESS);
        expect(order.startedAt).toBeTruthy();
    });

    it('should throw when approving budget not in WAITING_APPROVAL', () => {
        const order = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1' });
        expect(() => order.approveBudget()).toThrow(DomainException);
    });

    it('should update services amount and recalculate total', () => {
        const order = new ServiceOrder({
            id: '1', customerId: 'c-1', vehicleId: 'v-1',
            stockItemsAmount: 200,
        });

        order.updateServicesAmount(150);
        expect(order.servicesAmount).toBe(150);
        expect(order.totalAmount).toBe(350);
    });

    it('should update stock items amount and recalculate total', () => {
        const order = new ServiceOrder({
            id: '1', customerId: 'c-1', vehicleId: 'v-1',
            servicesAmount: 100,
        });

        order.updateStockItemsAmount(300);
        expect(order.stockItemsAmount).toBe(300);
        expect(order.totalAmount).toBe(400);
    });

    it('should recalculate total correctly', () => {
        const order = new ServiceOrder({
            id: '1', customerId: 'c-1', vehicleId: 'v-1',
            servicesAmount: 100, stockItemsAmount: 200,
        });

        order.recalculateTotal();
        expect(order.totalAmount).toBe(300);
    });

    it('should create with all props', () => {
        const now = new Date();
        const order = new ServiceOrder({
            id: '1', customerId: 'c-1', vehicleId: 'v-1',
            status: ServiceOrderStatus.IN_PROGRESS,
            diagnosis: 'test',
            servicesAmount: 100, stockItemsAmount: 50, totalAmount: 150,
            createdAt: now, startedAt: now, finishedAt: null,
            deliveredAt: null, updatedAt: now,
        });

        expect(order.diagnosis).toBe('test');
        expect(order.status).toBe(ServiceOrderStatus.IN_PROGRESS);
        expect(order.startedAt).toBe(now);
    });
});