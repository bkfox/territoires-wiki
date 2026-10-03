<script setup lang="ts">
import { computed, ref } from "vue"
import {debounce} from "lodash-es"
import { LIcon, LMap, LMarker, LPopup, LTileLayer } from "@vue-leaflet/vue-leaflet"
import "leaflet/dist/leaflet.css"

import SmwQuery from "./SmwQuery.vue"
import type { Coordinates, SmwQueryOptions } from "@/types/smw"

const props = withDefaults(defineProps<{
    query: SmwQueryOptions
    center?: [number, number]
    zoom?: number
    height?: string
    tileUrl?: string
    attribution?: string
}>(), {
    center: () => [50.5, 4.5],
    zoom: 7,
    height: "400px",
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
})
const zoom = ref(props.zoom)

const initialCenter = computed<[number, number]>(() => props.center ?? [50.5, 4.5])

// TODO: observe
const currentQuery = ref(props.query)

function refreshQuery(event: { target: LeafletMap }) {
    const map = event.target
    const bounds = map.getBounds()
    const center = map.getCenter()

    currentQuery.value = {
        ...props.query,
        nearby: {
            latitude: center.lat,
            longitude: center.lng,
            radiusKm: calculateBoundsRadius(map),
            property: props.query.coordinates ?? "coordinates",
        },
    }
}

const debouncedRefreshQuery = debounce(refreshQuery, 300)


function calculateBoundsRadius(map: LeafletMap, margin: number=0): number {
    const bounds = map.getBounds()
    const center = map.getCenter()

    const corners = [
        bounds.getNorthWest(),
        bounds.getNorthEast(),
        bounds.getSouthWest(),
        bounds.getSouthEast(),
    ]

    return Math.max(
        ...corners.map(corner =>
            center.distanceTo(corner) / 1000
        )
    ) + margin
}
</script>

<template>
    <SmwQuery :query="currentQuery">
        <template #default="{ results, loading, error }">
            <div class="w-content-map" :style="{ height }">
                <v-slot name="left" :results="results" :loading="loading"></v-slot>
                <div class="w-content-map-map" :style="{height}">
                    <LMap v-model:zoom="zoom" :center="initialCenter">
                        <LTileLayer :url="tileUrl" :attribution="tileAttribution" layer-type="base" name="Map" />
                        <template v-for="result in results">
                            <LMarker
                                v-if="result?.coordinates"
                                :key="result.title"
                                :lat-lng="result.coordinates"
                            >
                                <!-- LIcon
                                    v-if="result.icon"
                                    :icon-url="result.icon.url"
                                    :icon-size="result.icon.size"
                                    :icon-anchor="result.icon.anchor"
                                    :popup-anchor="result.icon.popupAnchor"
                                / -->

                                <LPopup>
                                    <h3><a :href="result.url">{{ result.title }}</a></h3>
                                    <div v-if="result.distanceKm !== undefined">
                                        {{ result.distanceKm.toFixed(1) }} km
                                    </div>
                                    <p class="mt-1 mb-1">{{ result.extract }}</p>
                                </LPopup>
                            </LMarker>
                        </template>
                    </LMap>
                    <v-slot name="right" :results="results" :loading="loading"></v-slot>
                </div>
            </div>
            <v-slot name="default" :results="results" :loading="loading"></v-slot>
            <v-progress-linear v-if="loading" indeterminate />
            <v-alert v-if="error" type="error" density="compact" class="mt-2">{{ error.message }}</v-alert>
        </template>
    </SmwQuery>
</template>
<style>
.w-content-map {
    position: relative;
}

.w-content-map .w-content-map-list {
    position: absolute;
    top: 0px;
    min-width: 300px;
    height: 100%;
    width: 50%;
}
</style>
