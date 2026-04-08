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

    it('should throw when sending budget without diagnosis', () => {
        const serviceOrder = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1' });
        expect(() => serviceOrder.sendBudgetForApproval()).toThrow(DomainException);
    });

    it('should send budget for approval', () => {
        const serviceOrder = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1' });
        serviceOrder.registerDiagnosis('issue');
        serviceOrder.sendBudgetForApproval();
        expect(serviceOrder.status).toBe(ServiceOrderStatus.WAITING_APPROVAL);
    });

    it('should throw when finishing without IN_PROGRESS', () => {
        const serviceOrder = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1' });
        expect(() => serviceOrder.finish()).toThrow(DomainException);
    });

    it('should throw when delivering without FINISHED', () => {
        const serviceOrder = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1' });
        expect(() => serviceOrder.deliver()).toThrow(DomainException);
    });

    it('should deliver when FINISHED', () => {
        const serviceOrder = new ServiceOrder({ id: '1', customerId: 'c-1', vehicleId: 'v-1', status: ServiceOrderStatus.FINISHED });
        serviceOrder.deliver();
        expect(serviceOrder.status).toBe(ServiceOrderStatus.DELIVERED);
    });
});