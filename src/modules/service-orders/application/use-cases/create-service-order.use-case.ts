import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceOrder } from '../../domain/entities/service-order.entity';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';
import { CreateServiceOrderDto } from '../dto/create-service-order.dto';

@Injectable()
export class CreateServiceOrderUseCase {
    constructor(
        @Inject(ServiceOrderRepository)
        private readonly serviceOrderRepository: ServiceOrderRepository,
    ) { }

    async execute(input: CreateServiceOrderDto): Promise<{ id: string }> {
        const serviceOrder = new ServiceOrder({
            id: randomUUID(),
            customerId: input.customerId,
            vehicleId: input.vehicleId,
        });

        await this.serviceOrderRepository.create(serviceOrder);

        return { id: serviceOrder.id };
    }
}