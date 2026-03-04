import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DeviceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    CUTOFF = 'CUTOFF',
}

export enum DeviceType {
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    INDUSTRIAL = 'INDUSTRIAL',
}

@Entity('devices')
export class Device {
    @PrimaryColumn()
    id: string; // UID from QR code

    @Column({
        type: 'enum',
        enum: DeviceType,
        default: DeviceType.RESIDENTIAL,
    })
    type: DeviceType;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    location: string;

    @Column({
        type: 'enum',
        enum: DeviceStatus,
        default: DeviceStatus.ACTIVE,
    })
    status: DeviceStatus;

    @Column({ default: false })
    isValveBlocked: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastActivity: Date;

    @CreateDateColumn()
    registrationTimestamp: Date;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @ManyToOne(() => User, (user) => user.devices)
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Column({ type: 'uuid', nullable: true })
    ownerId: string;
}
