import type { Coordinates } from "@/types/smw"
import type { MapIcon } from '@/types/map'

import { calculateDistance } from './geo'

export interface SmwResultOptions {
    title: string
    url: string
    properties?: Record<string, unknown[]>
    categories?: string[]
    coordinates?: Coordinates
}

export class SmwResult {
    readonly title: string
    readonly url: string
    readonly properties: Record<string, unknown[]>
    readonly categories: string[]
    readonly coordinates?: number[]

    extract?: string
    distanceKm: number
    icon: MapIcon

    constructor(options: SmwResultOptions) {
        this.title = options.title
        this.url = options.url
        this.properties = options.properties ?? {}
        this.categories = options.categories ?? []
        this.coordinates = options.coordinates
    }

    hasCategory(category: string): boolean {
        const normalized = normalizeCategory( category, )
        return this.categories.some( (value) => normalizeCategory(value) === normalized, )
    }

    distanceTo( coordinates: Coordinates, ): number | undefined {
        if (!this.coordinates) {
            return undefined
        }

        return calculateDistance( this.coordinates, coordinates, )
    }

    getProperty<T = unknown>( name: string, ): T[] {
        return (this.properties[name] ?? []) as T[]
    }

    getFirstProperty<T = unknown>( name: string, ): T | undefined {
        return this.getProperty<T>(name)[0]
    }
}

function normalizeCategory( category: string, ): string {
    return category.replace(/^Category:/i, "")
}

