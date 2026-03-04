import { Device } from '../../devices/entities/device.entity';
export declare enum ReportSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export declare enum ReportStatus {
    NEW = "NEW",
    BLOCKED = "BLOCKED",
    DISMISSED = "DISMISSED"
}
export declare class Report {
    id: string;
    deviceId: string;
    device: Device;
    severity: ReportSeverity;
    status: ReportStatus;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    resolvedAt: Date;
}
