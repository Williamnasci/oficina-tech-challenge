import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceOrder } from '../../domain/entities/service-order.entity';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';

@Injectable()
export class GetServiceOrderUseCase {
    constructor(
        @Inject(ServiceOrderRepository)
        private readonly serviceOrderRepository: ServiceOrderRepository,
    ) {}

    async execute(id: string): Promise<ServiceOrder> {
        const serviceOrder = await this.serviceOrderRepository.findById(id);

        if (!serviceOrder) {
            throw new NotFoundException('Service order not found.');
        }

        return serviceOrder;
    }
}
