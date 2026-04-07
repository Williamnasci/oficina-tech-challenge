import { ServiceOrderStatus } from '../enums/service-order-status.enum';

export class ServiceOrder {
    constructor(
        public readonly id: string,
        public readonly customerId: string,
        public readonly vehicleId: string,
        public status: ServiceOrderStatus,
        public diagnosis: string | null,
        public servicesAmount: number,
        public stockItemsAmount: number,
        public totalAmount: number,
        public readonly createdAt: Date,
        public startedAt: Date | null,
        public finishedAt: Date | null,
        public deliveredAt: Date | null,
        public updatedAt: Date,
    ) { }

    startDiagnosis(): void {
        this.status = ServiceOrderStatus.IN_DIAGNOSIS;
        this.startedAt = new Date();
        this.updatedAt = new Date();
    }

    finish(): void {
        this.status = ServiceOrderStatus.FINISHED;
        this.finishedAt = new Date();
        this.updatedAt = new Date();
    }

    deliver(): void {
        this.status = ServiceOrderStatus.DELIVERED;
        this.deliveredAt = new Date();
        this.updatedAt = new Date();
    }
}