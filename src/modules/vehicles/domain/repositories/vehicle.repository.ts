import { Vehicle } from '../entities/vehicle.entity';

export abstract class VehicleRepository {
    abstract create(vehicle: Vehicle): Promise<void>;
    abstract findById(id: string): Promise<Vehicle | null>;
    abstract findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
}