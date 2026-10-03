import type { MapIconMapping } from '@/types/map'

export interface Coordinates {
    latitude: number
    longitude: number
}

/**
 * One SMW geographic-coordinate property,
 * or two numeric properties containing latitude and longitude.
 */
export type CoordinatesSource =
    | string
    | readonly [latitudeProperty: string, longitudeProperty: string]

export type SmwFilterOperator = string

export interface SmwFilter {
    property: string
    operator: SmwFilterOperator
    value?: string | number
}

export interface SmwSort {
    property: string
    order?: "asc" | "desc"
}

export interface SmwNearby {
    latitude: number
    longitude: number
    radiusKm: number

    /**
     * SMW Geographic coordinate property used for the
     * native distance filter.
     *
     * If omitted, `coordinates` must be a string property.
     */
    property?: string

    /**
     * Sort the normalized results by their calculated distance.
     */
    sort?: boolean
}

export interface SmwQueryOptions {
    /** Pages categories **/
    categories?: string[]
    /** Parameters filters **/
    filters?: SmwFilter[]
    /** Coordinates **/
    coordinates?: CoordinatesSource
    /** Distance from the provided coordinates **/
    nearby?: SmwNearby
    /** Return those properties. **/
    printouts?: string[]
    /** Sort order **/
    sort?: SmwSort

    limit?: number
    offset?: number

    extracts?: Boolean
    icons?: MapIconMapping
}
