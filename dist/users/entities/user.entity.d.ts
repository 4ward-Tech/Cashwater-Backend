import { Device } from '../../devices/entities/device.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    isSuspended: boolean;
    createdAt: Date;
    devices: Device[];
}
