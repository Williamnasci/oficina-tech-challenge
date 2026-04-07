import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { ServiceOrder } from '../../domain/entities/service-order.entity';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';

@Injectable()
export class PrismaServiceOrderRepository implements ServiceOrderRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(order: ServiceOrder): Promise<void> {
        await this.prisma.serviceOrder.create({
            data: {
                id: order.id,
                customerId: order.customerId,
                vehicleId: order.vehicleId,
                status: order.status,
                diagnosis: order.diagnosis,
                servicesAmount: order.servicesAmount,
                stockItemsAmount: order.stockItemsAmount,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt,
                startedAt: order.startedAt,
                finishedAt: order.finishedAt,
                deliveredAt: order.deliveredAt,
                updatedAt: order.updatedAt,
            },
        });
    }

    async findById(id: string): Promise<ServiceOrder | null> {
        const data = await this.prisma.serviceOrder.findUnique({ where: { id } });

        if (!data) return null;

        return new ServiceOrder({
            id: data.id,
            customerId: data.customerId,
            vehicleId: data.vehicleId,
            status: data.status as any,
            diagnosis: data.diagnosis,
            servicesAmount: Number(data.servicesAmount),
            stockItemsAmount: Number(data.stockItemsAmount),
            totalAmount: Number(data.totalAmount),
            createdAt: data.createdAt,
            startedAt: data.startedAt,
            finishedAt: data.finishedAt,
            deliveredAt: data.deliveredAt,
            updatedAt: data.updatedAt,
        });
    }

    async findAll(): Promise<ServiceOrder[]> {
        const data = await this.prisma.serviceOrder.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return data.map(
            (item) =>
                new ServiceOrder({
                    id: item.id,
                    customerId: item.customerId,
                    vehicleId: item.vehicleId,
                    status: item.status as any,
                    diagnosis: item.diagnosis,
                    servicesAmount: Number(item.servicesAmount),
                    stockItemsAmount: Number(item.stockItemsAmount),
                    totalAmount: Number(item.totalAmount),
                    createdAt: item.createdAt,
                    startedAt: item.startedAt,
                    finishedAt: item.finishedAt,
                    deliveredAt: item.deliveredAt,
                    updatedAt: item.updatedAt,
                }),
        );
    }

    async update(order: ServiceOrder): Promise<void> {
        await this.prisma.serviceOrder.update({
            where: { id: order.id },
            data: {
                status: order.status,
                diagnosis: order.diagnosis,
                servicesAmount: order.servicesAmount,
                stockItemsAmount: order.stockItemsAmount,
                totalAmount: order.totalAmount,
                startedAt: order.startedAt,
                finishedAt: order.finishedAt,
                deliveredAt: order.deliveredAt,
                updatedAt: order.updatedAt,
            },
        });
    }
}
