import type { Coordinates, GeocodingResult } from "@/types/geocoding"

export interface Geocoder {
    search(query: string): Promise<GeocodingResult[]>
    reverse(coordinates: Coordinates): Promise<GeocodingResult | undefined>
}
