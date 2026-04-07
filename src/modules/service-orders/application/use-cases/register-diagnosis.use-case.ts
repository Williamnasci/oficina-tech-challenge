import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';
import { RegisterDiagnosisDto } from '../dto/register-diagnosis.dto';

@Injectable()
export class RegisterDiagnosisUseCase {
    constructor(
        @Inject(ServiceOrderRepository)
        private readonly serviceOrderRepository: ServiceOrderRepository,
    ) { }

    async execute(serviceOrderId: string, input: RegisterDiagnosisDto): Promise<void> {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId);

        if (!serviceOrder) {
            throw new NotFoundException('Service order not found.');
        }

        serviceOrder.registerDiagnosis(input.diagnosis);

        await this.serviceOrderRepository.update(serviceOrder);
    }
}