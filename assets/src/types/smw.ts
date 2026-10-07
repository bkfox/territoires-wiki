import type { MapIconMapping } from '@/types/map'


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


// src/types/smw.ts
export interface SmwBounds {
    property?: string
    north: number
    south: number
    east: number
    west: number
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
    /** Items in this bounding view **/
    bounds?: SmwBounds
    /** Return those properties. **/
    printouts?: string[]
    /**
     * Sort order.
     * 
     * Can have one of the following formats:
     * - `-[NAME]`, `[NAME]`: sort desc/asc by property
     * - `?`: random sort
     */
    sort?: string | "?"

    limit?: number
    offset?: number

    extracts?: Boolean
    icons?: MapIconMapping
}
