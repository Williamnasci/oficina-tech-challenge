import { DomainException } from '../../../../../../src/shared/domain/errors/domain.exception';
import { ServiceOrder } from '../../../../../../src/modules/service-orders/domain/entities/service-order.entity';
import { ServiceOrderStatus } from '../../../../../../src/modules/service-orders/domain/enums/service-order-status.enum';

describe('ServiceOrder Entity', () => {
    it('should create a service order with default status RECEIVED', () => {
        const serviceOrder = new ServiceOrder({
            id: '1',
            customerId: 'customer-1',
            vehicleId: 'vehicle-1',
        });

        expect(serviceOrder.status).toBe(ServiceOrderStatus.RECEIVED);
        expect(serviceOrder.servicesAmount).toBe(0);
        expect(serviceOrder.stockItemsAmount).toBe(0);
        expect(serviceOrder.totalAmount).toBe(0);
    });

    it('should register diagnosis and change status to IN_DIAGNOSIS', () => {
        const serviceOrder = new ServiceOrder({
            id: '1',
            customerId: 'customer-1',
            vehicleId: 'vehicle-1',
        });

        serviceOrder.registerDiagnosis('Brake issue');

        expect(serviceOrder.diagnosis).toBe('Brake issue');
        expect(serviceOrder.status).toBe(ServiceOrderStatus.IN_DIAGNOSIS);
    });

    it('should throw when registering empty diagnosis', () => {
        const serviceOrder = new ServiceOrder({
            id: '1',
            customerId: 'customer-1',
            vehicleId: 'vehicle-1',
        });

        expect(() => serviceOrder.registerDiagnosis('')).toThrow(DomainException);
    });

    it('should throw when starting execution without WAITING_APPROVAL status', () => {
        const serviceOrder = new ServiceOrder({
            id: '1',
            customerId: 'customer-1',
            vehicleId: 'vehicle-1',
        });

        expect(() => serviceOrder.startExecution()).toThrow(DomainException);
    });

    it('should finish only when IN_PROGRESS', () => {
        const serviceOrder = new ServiceOrder({
            id: '1',
            customerId: 'customer-1',
            vehicleId: 'vehicle-1',
            status: ServiceOrderStatus.WAITING_APPROVAL,
        });

        serviceOrder.startExecution();
        serviceOrder.finish();

        expect(serviceOrder.status).toBe(ServiceOrderStatus.FINISHED);
        expect(serviceOrder.finishedAt).toBeTruthy();
    });
});