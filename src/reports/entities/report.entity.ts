import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Device } from '../../devices/entities/device.entity';

export enum ReportSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum ReportStatus {
    NEW = 'NEW',
    BLOCKED = 'BLOCKED',
    DISMISSED = 'DISMISSED',
}

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    deviceId: string;

    @ManyToOne(() => Device, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'deviceId' })
    device: Device;

    @Column({
        type: 'enum',
        enum: ReportSeverity,
        default: ReportSeverity.MEDIUM,
    })
    severity: ReportSeverity;

    @Column({
        type: 'enum',
        enum: ReportStatus,
        default: ReportStatus.NEW,
    })
    status: ReportStatus;

    @Column({ type: 'text', nullable: true })
    description: string;

    /** Resolved human-readable location (from geocoding or device) */
    @Column({ nullable: true })
    location: string;

    /** GPS coords at the time of reporting */
    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    resolvedAt: Date;
}
