import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity('location_cache')
@Index(['latitude', 'longitude'], { unique: true })
export class LocationCache {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double precision' })
    latitude: number;

    @Column({ type: 'double precision' })
    longitude: number;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    sector: string; // suburb/village/town

    @Column({ nullable: true })
    district: string; // county/city_district

    @Column({ nullable: true })
    province: string; // state

    @Column({ default: 'Rwanda' })
    country: string;

    @CreateDateColumn()
    createdAt: Date;
}

