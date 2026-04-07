import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { LicensePlate } from '../../domain/value-objects/license-plate.value-object';

@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(vehicle: Vehicle): Promise<void> {
        await this.prisma.vehicle.create({
            data: {
                id: vehicle.id,
                customerId: vehicle.customerId,
                licensePlate: vehicle.licensePlate.value,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                createdAt: vehicle.createdAt,
                updatedAt: vehicle.updatedAt,
            },
        });
    }

    async findById(id: string): Promise<Vehicle | null> {
        const data = await this.prisma.vehicle.findUnique({ where: { id } });

        if (!data) return null;

        return new Vehicle({
            id: data.id,
            customerId: data.customerId,
            licensePlate: new LicensePlate(data.licensePlate),
            brand: data.brand,
            model: data.model,
            year: data.year,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
        const normalizedPlate = licensePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        const data = await this.prisma.vehicle.findUnique({
            where: { licensePlate: normalizedPlate },
        });

        if (!data) return null;

        return new Vehicle({
            id: data.id,
            customerId: data.customerId,
            licensePlate: new LicensePlate(data.licensePlate),
            brand: data.brand,
            model: data.model,
            year: data.year,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
}