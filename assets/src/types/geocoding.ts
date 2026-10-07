export type Coordinates = [
    latitude: number,
    longitude: number,
]

export interface GeocodingResult {
    coordinates: Coordinates
    displayName: string
    osmId?: number
    osmType?: string
    type?: string
    category?: string
}
