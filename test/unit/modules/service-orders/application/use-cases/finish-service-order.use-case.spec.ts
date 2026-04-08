import { FinishServiceOrderUseCase } from '../../../../../../src/modules/service-orders/application/use-cases/finish-service-order.use-case';
import { ServiceOrderRepository } from '../../../../../../src/modules/service-orders/domain/repositories/service-order.repository';

describe('FinishServiceOrderUseCase', () => {
    let useCase: FinishServiceOrderUseCase;
    let repository: jest.Mocked<ServiceOrderRepository>;
    let mockServiceOrder: any;

    beforeEach(() => {
        mockServiceOrder = {
            finish: jest.fn(),
        };
        repository = {
            findById: jest.fn().mockResolvedValue(mockServiceOrder),
            update: jest.fn(),
        } as any;
        useCase = new FinishServiceOrderUseCase(repository);
    });

    it('should finish a service order', async () => {
        await useCase.execute('order-1');
        expect(repository.findById).toHaveBeenCalledWith('order-1');
        expect(mockServiceOrder.finish).toHaveBeenCalled();
        expect(repository.update).toHaveBeenCalledWith(mockServiceOrder);
    });
});
