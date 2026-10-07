import type { Geocoder } from "./useGeocoder"
import type { Coordinates, GeocodingResult } from "@/types/geocoding"


interface NominatimResult {
    lat: string
    lon: string
    display_name: string
    osm_id?: number
    osm_type?: string
    type?: string
    category?: string
}


export interface NominatimOptions {
    endpoint?: string
    reverseEndpoint?: string
    language?: string
    countryCodes?: string[]
    limit?: number
}


export function useNominatim(options: NominatimOptions = {}): Geocoder {
    const endpoint = options.endpoint
        ?? "https://nominatim.openstreetmap.org/search"

    const reverseEndpoint = options.reverseEndpoint
        ?? "https://nominatim.openstreetmap.org/reverse"

    function mapResult(result: NominatimResult): GeocodingResult {
        return {
            coordinates: [ Number(result.lat), Number(result.lon) ],
            displayName: result.display_name,
            osmId: result.osm_id,
            osmType: result.osm_type,
            type: result.type,
            category: result.category,
        }
    }

    async function search( query: string ): Promise<GeocodingResult[]> {
        const trimmedQuery = query.trim()

        if (!trimmedQuery)
            return []

        const params = new URLSearchParams({
            format: "jsonv2",
            q: trimmedQuery,
            limit: String(options.limit ?? 5),
        })

        if (options.language)
            params.set("accept-language", options.language)

        if (options.countryCodes?.length)
            params.set("countrycodes", options.countryCodes.join(","))

        const response = await fetch(`${endpoint}?${params}`)
        if (!response.ok)
            throw new Error(
                `Nominatim request failed with status ${response.status}`,
            )

        const data = await response.json() as NominatimResult[]
        return data.map(mapResult)
    }

    async function reverse(coordinates: Coordinates): Promise<GeocodingResult | undefined> {
        const [latitude, longitude] = coordinates
        const params = new URLSearchParams({
            format: "jsonv2",
            lat: String(latitude),
            lon: String(longitude),
        })

        if (options.language)
            params.set("accept-language", options.language)

        const response = await fetch(`${reverseEndpoint}?${params}`)

        if (!response.ok)
            throw new Error(
                `Nominatim reverse request failed with status ${response.status}`,
            )

        const data = await response.json() as NominatimResult
        if (!data.display_name)
            return undefined
        return mapResult(data)
    }

    return { search, reverse }
}
