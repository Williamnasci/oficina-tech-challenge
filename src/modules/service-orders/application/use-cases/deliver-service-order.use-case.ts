import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';

@Injectable()
export class DeliverServiceOrderUseCase {
    constructor(
        @Inject(ServiceOrderRepository)
        private readonly serviceOrderRepository: ServiceOrderRepository,
    ) { }

    async execute(serviceOrderId: string): Promise<void> {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId);

        if (!serviceOrder) {
            throw new NotFoundException('Service order not found.');
        }

        serviceOrder.deliver();

        await this.serviceOrderRepository.update(serviceOrder);
    }
}