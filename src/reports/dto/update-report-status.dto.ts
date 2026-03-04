import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '../entities/report.entity';

export class UpdateReportStatusDto {
    @IsEnum(ReportStatus)
    status: ReportStatus;

    @IsOptional()
    @IsString()
    notes?: string;
}
