import { CreateServiceOrderUseCase } from '../../../../../../src/modules/service-orders/application/use-cases/create-service-order.use-case';
import { ServiceOrderRepository } from '../../../../../../src/modules/service-orders/domain/repositories/service-order.repository';

describe('CreateServiceOrderUseCase', () => {
    let useCase: CreateServiceOrderUseCase;
    let repository: jest.Mocked<ServiceOrderRepository>;

    beforeEach(() => {
        repository = {
            create: jest.fn(),
            findById: jest.fn(),
            findDetailsById: jest.fn(),
            update: jest.fn(),
            addServiceToOrder: jest.fn(),
            addStockItemToOrder: jest.fn(),
        } as any;
        useCase = new CreateServiceOrderUseCase(repository);
    });

    it('should create a service order', async () => {
        const result = await useCase.execute({ customerId: 'cust-1', vehicleId: 'veh-1' });
        expect(repository.create).toHaveBeenCalled();
        expect(result.id).toBeDefined();
    });
});
