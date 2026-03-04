import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReportSeverity } from '../entities/report.entity';

export class CreateReportDto {
    @IsNotEmpty()
    @IsString()
    deviceId: string;

    @IsEnum(ReportSeverity)
    severity: ReportSeverity;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;
}
