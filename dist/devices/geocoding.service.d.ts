import { Repository } from 'typeorm';
import { LocationCache } from './entities/location-cache.entity';
export declare class GeocodingService {
    private locationCacheRepository;
    private readonly logger;
    private lastRequestTime;
    private readonly minRequestInterval;
    private processingQueue;
    constructor(locationCacheRepository: Repository<LocationCache>);
    reverseGeocode(latitude: number, longitude: number): Promise<string>;
}
