import type { Coordinates, SmwBounds } from "@/types/smw"


const EARTH_RADIUS_KM = 6371


export function latitudeDegreesForDistance(distanceKm: number): number {
    return distanceKm / EARTH_RADIUS_KM * 180 / Math.PI
}

export function longitudeDegreesForDistance(
    distanceKm: number,
    latitude: number,
): number {
    return (
        distanceKm /
        (EARTH_RADIUS_KM * Math.cos(latitude * Math.PI / 180)) *
        180 / Math.PI
    )
}

/*
export function expandBounds(
    bounds: SmwBounds,
    marginKm: number,
): SmwBounds {
    const latitudeDelta = latitudeDegreesForDistance(marginKm)
    const centerLatitude = (bounds.north + bounds.south) / 2
    const longitudeDelta = longitudeDegreesForDistance(
        marginKm,
        centerLatitude,
    )

    return {
        property: bounds.property,
        north: bounds.north + latitudeDelta,
        south: bounds.south - latitudeDelta,
        east: bounds.east + longitudeDelta,
        west: bounds.west - longitudeDelta,
    }
}
*/


export function containsBounds( outer: SmwBounds, inner: SmwBounds, ): boolean {
    return (
        inner.north <= outer.north &&
        inner.south >= outer.south &&
        inner.east <= outer.east &&
        inner.west >= outer.west
    )
}


export function calculateDistance( first: Coordinates, second: Coordinates, ): number {
    const latitude1 = degreesToRadians(first.latitude)
    const latitude2 = degreesToRadians(second.latitude)
    const deltaLatitude = degreesToRadians(second.latitude - first.latitude)
    const deltaLongitude = degreesToRadians(second.longitude - first.longitude)

    const value =
        Math.sin(deltaLatitude / 2) ** 2 +
        Math.cos(latitude1) *
        Math.cos(latitude2) *
        Math.sin(deltaLongitude / 2) ** 2

    return EARTH_RADIUS_KM * 2 * Math.atan2(
        Math.sqrt(value),
        Math.sqrt(1 - value),
    )
}



// ---- Leaflet
/** Shorthand to get SmwBounds from a map **/
export function getMapBounds(map: Leaflet): SmwBounds {
    const bounds = map.getBounds()
    return {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
        east: bounds.getEast(),
    }
}

/** Returns new bounds with a margin (in pixels) **/
export function getExpandedBounds( map: LeafletMap, marginPixels: number, ): SmwBounds {
    const bounds = map.getBounds()

    const northWest = map.latLngToContainerPoint(bounds.getNorthWest())
    const southEast = map.latLngToContainerPoint(bounds.getSouthEast())

    const expandedNorthWest = northWest.subtract([ marginPixels, marginPixels, ])
    const expandedSouthEast = southEast.add([ marginPixels, marginPixels, ])

    const northWestLatLng = map.containerPointToLatLng(expandedNorthWest)
    const southEastLatLng = map.containerPointToLatLng(expandedSouthEast)

    return {
        property: "coordinates",
        north: northWestLatLng.lat,
        south: southEastLatLng.lat,
        east: southEastLatLng.lng,
        west: northWestLatLng.lng,
    }
}
