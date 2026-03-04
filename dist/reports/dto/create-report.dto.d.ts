import { ReportSeverity } from '../entities/report.entity';
export declare class CreateReportDto {
    deviceId: string;
    severity: ReportSeverity;
    description?: string;
    latitude?: number;
    longitude?: number;
}
