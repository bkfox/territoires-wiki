import type { Coordinates } from "./geocoding"

export interface Place {
    address: string
    country: string
    coordinates?: Coordinates
}
