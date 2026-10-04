import { ref, type Ref, } from "vue"

import { SmwResult, } from "@/smw/result"
import type { Coordinates, CoordinatesSource, SmwFilter, SmwNearby, SmwQueryOptions,
} from "@/types/smw"
import {fetchExtracts} from './pages'


interface SmwApiResult {
    fulltext: string
    fullurl?: string
    printouts?: Record<string, unknown[]>
}

interface SmwApiResponse {
    query?: {
        results?: Record<string, SmwApiResult>
        "query-continue-offset"?: number
    }
    error?: { code: string, info: string }
}


interface CategoriesApiResponse {
    query?: {
        pages?: Array<{
            title: string
            categories?: Array<{title: string}>
        }>
    }
    error?: { code: string, info: string }
}


export function useSmwQuery() {
    const results: Ref<SmwResult[]> = ref([])
    const loading = ref(false)
    const error: Ref<Error | null> = ref(null)
    const hasMore = ref(false)

    async function search( options: SmwQueryOptions, ): Promise<SmwResult[]> {
        loading.value = true
        error.value = null

        try {
            const response = await requestSmw( options, )
            const normalized = normalizeResults( response, options.coordinates, )

            if (options.extracts && normalized) {
                const extracts = await fetchExtracts(normalized.map(r => r.title))
                for(const result of normalized)
                    result.extract = extracts[result.title]
            }

            if (options.nearby)
                applyNearbyDistance( normalized, options, )

            // if (shouldLoadCategories(options))
            //    await loadCategories( normalized, )

            results.value = normalized

            if ( options.nearby?.sort ) {
                results.value.sort(
                    (left, right) =>
                        ( left.distanceTo( options.nearby!, ) ?? Infinity ) -
                        ( right.distanceTo( options.nearby!, ) ?? Infinity ),
                )
            }

            hasMore.value = Boolean(response.query?.["query-continue-offset"])
            return results.value
        } catch (cause) {
            console.log(cause)

            const exception = cause instanceof Error ? cause : new Error(String(cause))
            error.value = exception
            results.value = []

            throw exception
        } finally { loading.value = false }
    }

    return { results, loading, error, hasMore, search, }
}


async function requestSmw( options: SmwQueryOptions, ): Promise<SmwApiResponse> {
    const query = buildQuery(options)
    const api = new mw.Api()
    const response = await api.get({ action: "ask", query, format: "json", formatversion: 2, }) as SmwApiResponse

    if (response.error)
        throw new Error( response.error.info, )
    return response
}


// ---- Query
function buildQuery( options: SmwQueryOptions, ): string {
    const parts: string[] = []

    addCategoryCondition( parts, options.categories, )

    for (const filter of options.filters ?? [])
        parts.push( buildFilter(filter), )


    for ( const printout of getPrintouts(options) )
        parts.push( `?${printout}`, )

    if (options.sort) {
        const sort = options.sort.replace("-", "")
        const order = options.sort.includes("-") ? "descending": "ascending"
        parts.push( `sort=${sort}`, `order=${order}`, )
    }

    if (options.limit !== undefined)
        parts.push( `limit=${options.limit}`, )

    if (options.offset !== undefined)
        parts.push( `offset=${options.offset}`, )

    if(options.nearby)
        addCoordinateCondition( parts, options, )
    else if(options.bounds) {
        const property = options.bounds.property ?? "coordinates"
        parts.push(buildBoundsCondition(property, options.bounds))
    }

    return parts.join("|")
}


function addCategoryCondition( parts: string[], categories?: string[], ): void {
    if (!categories?.length)
        return

    if (categories.length === 1)
        parts.push(`[[Category:${categories[0]}]]`)
    else
        parts.push(`[[Category:${categories.join( "]] OR [[Category:", )}]]`)
}


const filterOps = {
    "exists": "[[{property}::+]]",
    "==": "[[{property}::{value}]]",
    "!=": "[[{property}::!{value}]]",
    ">": "[[{property}::>{value}]]",
    ">=": "[[{property}::>={value}]]",
    "<": "[[{property}::<{value}]]",
    "<=": "[[{property}::<={value}]]",
}

function buildFilter(filter: SmwFilter): string {
    const raw = filterOps[filter[1]]
    return raw?.replaceAll("{property}", filter[0]).replaceAll("{value}", filter[2])

}


function addCoordinateCondition( parts: string[], options: SmwQueryOptions, ): void {
    const nearby = options.nearby

    if (!nearby)
        return

    const property = nearby.property ?? getNearbyProperty(options.coordinates)
    parts.push( `[[${property}::${nearby.latitude},${nearby.longitude} (${parseInt(nearby.radiusKm)} km)]]`)
}


function getNearbyProperty( source?: CoordinatesSource, ): string {
    if (typeof source === "string")
        return source

    if (!source)
        throw new Error(
            "A geographic coordinate property is required " +
            "for a nearby query.",
        )

    throw new Error(
        "A nearby query cannot use latitude/longitude " +
        "properties directly. Provide nearby.property " +
        "with the SMW Geographic coordinate property.",
    )
}


function buildBoundsCondition(property: string, bounds: SmwBounds): string {
    return [
        `[[${property}::+]]`,
        `[[${property}::>${bounds.south}°, ${bounds.west}°]]`,
        `[[${property}::<${bounds.north}°, ${bounds.east}°]]`,
    ].join(" ")
}


// ---- Response
function getPrintouts( options: SmwQueryOptions, ): string[] {
    const properties = new Set(options.printouts ?? [])

    if (options.coordinates) {
        if ( typeof options.coordinates === "string" )
            properties.add( options.coordinates, )
        else {
            properties.add( options.coordinates[0], )
            properties.add( options.coordinates[1], )
        }
    }

    return [...properties]
}


function normalizeResults( response: SmwApiResponse, source?: CoordinatesSource, ): SmwResult[] {
    return Object.entries(response.query?.results ?? {}).map(([title, result]) => {
        const properties = result.printouts ?? {}

        return new SmwResult({
            title,
            url: result.fullurl ?? "",
            properties,
            coordinates: extractCoordinates( properties, source, ),
        })
    })
}


function applyNearbyDistance( results: SmwResult[], options: SmwQueryOptions, ): void {
    const nearby = options.nearby

    if (!nearby)
        return

    /*
     * SMW has already applied the authoritative radius
     * filter. We only calculate the exact distance locally
     * so consumers can display or sort it.
     */
    for (const result of results) {
        result.distanceKm = result.distanceTo({ latitude: nearby.latitude, longitude: nearby.longitude, })
    }
}

function extractCoordinates( properties: Record<string, unknown[]>, source?: CoordinatesSource="coordinates"): Coordinates | undefined {
    if (!source)
        return undefined

    if (typeof source === "string")
        return parseCoordinate( properties[source]?.[0], )

    const latitude = toNumber( properties[source[0]]?.[0], )
    const longitude = toNumber( properties[source[1]]?.[0], )

    if ( latitude === undefined || longitude === undefined )
        return undefined

    return [latitude, longitude]
}


function parseCoordinate( value: unknown, ): Coordinates | undefined {
    if (value?.lat !== undefined && value?.lon !== undefined)
        return [value.lat, value.lon]
    
    if (typeof value !== "string")
        return undefined

    const [lat, lon] = value.split(",").map( (part) => Number(part.trim()), )

    if ( !Number.isFinite(lat) || !Number.isFinite(lon) )
        return undefined

    return [lat, lon]
}


function toNumber( value: unknown, ): number | undefined {
    const number = typeof value === "number" ? value : Number(value)
    return Number.isFinite(number) ? number : undefined
}


async function loadCategories( results: SmwResult[], ): Promise<void> {
    if (!results.length)
        return

    const api = new mw.Api()
    const response = await api.get({
        action: "query",
        prop: "categories",
        titles: results.map(
            (result) => result.title,
        ).join("|"),
        cllimit: "max",
        format: "json",
        formatversion: 2,
    }) as CategoriesApiResponse

    if (response.error)
        throw new Error( response.error.info)

    const categories = new Map((response.query?.pages ?? [] ).map((page) => [
            page.title,
            (page.categories ?? []).map((category) => category.title),
    ]))

    for (const result of results)
        result.categories = categories.get(result.title) ?? []
}
