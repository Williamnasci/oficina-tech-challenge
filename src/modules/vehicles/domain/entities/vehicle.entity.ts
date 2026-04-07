import { LicensePlate } from '../value-objects/license-plate.value-object';

export type VehicleProps = {
    id: string;
    customerId: string;
    licensePlate: LicensePlate;
    brand: string;
    model: string;
    year: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Vehicle {
    public readonly id: string;
    public readonly customerId: string;
    public licensePlate: LicensePlate;
    public brand: string;
    public model: string;
    public year: number;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(props: VehicleProps) {
        this.id = props.id;
        this.customerId = props.customerId;
        this.licensePlate = props.licensePlate;
        this.brand = props.brand;
        this.model = props.model;
        this.year = props.year;
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt ?? new Date();
    }
}