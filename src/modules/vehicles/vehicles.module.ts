import { Module } from '@nestjs/common';
import { CreateVehicleUseCase } from './application/use-cases/create-vehicle.use-case';
import { VehicleRepository } from './domain/repositories/vehicle.repository';
import { PrismaVehicleRepository } from './infrastructure/repositories/prisma-vehicle.repository';
import { VehiclesController } from './interfaces/http/controllers/vehicles.controller';

@Module({
    controllers: [VehiclesController],
    providers: [
        CreateVehicleUseCase,
        {
            provide: VehicleRepository,
            useClass: PrismaVehicleRepository,
        },
    ],
    exports: [VehicleRepository],
})
export class VehiclesModule { }