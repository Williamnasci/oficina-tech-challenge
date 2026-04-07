import { ServiceOrderStatus } from '../../domain/enums/service-order-status.enum';

export class ServiceOrderResponseDto {
    id: string;
    customerId: string;
    vehicleId: string;
    status: ServiceOrderStatus;
    diagnosis: string | null;
    servicesAmount: number;
    stockItemsAmount: number;
    totalAmount: number;
    createdAt: Date;
    startedAt: Date | null;
    finishedAt: Date | null;
    deliveredAt: Date | null;
    updatedAt: Date;
}