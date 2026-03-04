import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationCache } from './entities/location-cache.entity';

@Injectable()
export class GeocodingService {
    private readonly logger = new Logger(GeocodingService.name);
    private lastRequestTime = 0;
    private readonly minRequestInterval = 1000; // 1 second for Nominatim rate limit
    private processingQueue: Promise<any> = Promise.resolve();

    constructor(
        @InjectRepository(LocationCache)
        private locationCacheRepository: Repository<LocationCache>,
    ) { }

    async reverseGeocode(latitude: number, longitude: number): Promise<string> {
        // Normalize coordinates to 6 decimal places (~10cm precision)
        const lat = parseFloat(Number(latitude).toFixed(6));
        const lon = parseFloat(Number(longitude).toFixed(6));

        // 1. Check Cache first (Sequential or Concurrent is fine for read-only)
        const cached = await this.locationCacheRepository.findOne({
            where: { latitude: lat, longitude: lon }
        });

        if (cached) {
            this.logger.log(`Cache hit for ${lat}, ${lon}: ${cached.displayName}`);
            return cached.displayName;
        }

        // 2. Sequential Queue for Nominatim API
        return this.processingQueue = this.processingQueue.then(async () => {
            // Re-check cache inside the queue in case a previous task filled it
            const lateCached = await this.locationCacheRepository.findOne({
                where: { latitude: lat, longitude: lon }
            });
            if (lateCached) return lateCached.displayName;

            // Rate Limit
            const now = Date.now();
            const wait = Math.max(0, this.minRequestInterval - (now - this.lastRequestTime));
            if (wait > 0) {
                await new Promise(resolve => setTimeout(resolve, wait));
            }

            try {
                this.logger.log(`Calling Nominatim API for: ${lat}, ${lon}`);

                // Add a timeout to the fetch call
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
                    {
                        headers: {
                            'User-Agent': 'WaterWalletApp/1.0 (contact@email.com)',
                        },
                        signal: controller.signal
                    }
                );
                clearTimeout(timeoutId);

                if (!response.ok) throw new Error(`Status ${response.status}`);

                const data = await response.json();
                this.lastRequestTime = Date.now();

                if (data && data.address) {
                    // Extract rich address parts as requested
                    const road = data.address.road || '';
                    const suburb = data.address.suburb || data.address.village || data.address.town || data.address.neighbourhood || '';
                    const city = data.address.city || data.address.city_district || '';
                    const district = data.address.county || '';
                    const province = data.address.state || '';

                    // Display name preference: road + suburb + district
                    const parts = [road, suburb, district].filter(p => p && p.length > 0);
                    const displayName = parts.length > 0 ? parts.join(', ') : data.display_name;

                    try {
                        const newCache = this.locationCacheRepository.create({
                            latitude: lat,
                            longitude: lon,
                            displayName,
                            sector: suburb,
                            district: district,
                            province: province,
                        });
                        await this.locationCacheRepository.save(newCache);
                        this.logger.log(`Cached result for ${lat}, ${lon}: ${displayName}`);
                    } catch (e) {
                        this.logger.warn(`Cache collision for ${lat}, ${lon}`);
                    }

                    return displayName;
                }

                return `${lat}, ${lon}`;
            } catch (error) {
                this.logger.error(`Geocoding fetch failed: ${error.message}`);
                return `${lat}, ${lon}`;
            }
        });
    }
}
