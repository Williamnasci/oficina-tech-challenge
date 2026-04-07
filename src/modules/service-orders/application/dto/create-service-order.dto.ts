import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateServiceOrderDto {
    @ApiProperty({
        description: 'Customer id (UUID)',
        example: '18201d07-08aa-4e2f-ae0e-35a06e0e5e49',
    })
    @IsUUID()
    customerId: string;

    @ApiProperty({
        description: 'Vehicle id (UUID)',
        example: '70af8254-8ffa-42d6-8593-c0a80b2be3a5',
    })
    @IsUUID()
    vehicleId: string;
}