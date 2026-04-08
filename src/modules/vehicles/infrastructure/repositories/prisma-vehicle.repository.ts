import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { LicensePlate } from '../../domain/value-objects/license-plate.value-object';

@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(vehicle: Vehicle): Promise<void> {
        try {
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('License plate already registered.');
                }

                if (error.code === 'P2003') {
                    throw new NotFoundException('Customer not found.');
                }
            }

            throw error;
        }
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