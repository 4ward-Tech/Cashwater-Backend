import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class RegisterDeviceDto {
    @IsNotEmpty()
    @IsString()
    deviceId: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsNumber()
    longitude?: number;
}
