import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ServiceOrder } from '../../domain/entities/service-order.entity';
import { ServiceOrderStatus } from '../../domain/enums/service-order-status.enum';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';

@Injectable()
export class CreateServiceOrderUseCase {
    constructor(private readonly repository: ServiceOrderRepository) { }

    async execute(input: {
        customerId: string;
        vehicleId: string;
        diagnosis?: string;
    }): Promise<ServiceOrder> {
        const now = new Date();

        const serviceOrder = new ServiceOrder(
            randomUUID(),
            input.customerId,
            input.vehicleId,
            ServiceOrderStatus.RECEIVED,
            input.diagnosis ?? null,
            0,
            0,
            0,
            now,
            null,
            null,
            null,
            now,
        );

        return this.repository.create(serviceOrder);
    }
}