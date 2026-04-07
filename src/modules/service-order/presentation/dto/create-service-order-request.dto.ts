import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateServiceOrderRequestDto {
    @IsUUID()
    customerId: string;

    @IsUUID()
    vehicleId: string;

    @IsOptional()
    @IsString()
    diagnosis?: string;
}