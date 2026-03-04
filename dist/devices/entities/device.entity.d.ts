import { User } from '../../users/entities/user.entity';
export declare enum DeviceStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    CUTOFF = "CUTOFF"
}
export declare enum DeviceType {
    RESIDENTIAL = "RESIDENTIAL",
    COMMERCIAL = "COMMERCIAL",
    INDUSTRIAL = "INDUSTRIAL"
}
export declare class Device {
    id: string;
    type: DeviceType;
    name: string;
    location: string;
    status: DeviceStatus;
    isValveBlocked: boolean;
    lastActivity: Date;
    registrationTimestamp: Date;
    latitude: number;
    longitude: number;
    owner: User;
    ownerId: string;
}
