<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import {debounce} from "lodash-es"
import { LControl, LIcon, LMap, LMarker, LPopup, LTileLayer } from "@vue-leaflet/vue-leaflet"
import "leaflet/dist/leaflet.css"

import SmwQuery from "./SmwQuery.vue"
import type { Coordinates, SmwQueryOptions } from "@/types/smw"
import { getMapBounds, getExpandedBounds, containsBounds } from '@/smw/geo'
import { useGeolocation } from '@/composables/useGeolocation'

const props = withDefaults(defineProps<{
    // ---- SMW
    /** SMW Query options **/
    query: SmwQueryOptions
    /** Preload margin bound **/
    boundsMargin: number

    // ---- Map
    /** Center of the map (lat,lon). **/
    center?: [number, number]
    /** Map zoom **/
    zoom?: number
    /** Map height **/
    height?: string
    /** Tiles URL **/
    tileUrl?: string
    /** Map attribution **/
    attribution?: string

    // ---- Settings
    autoloc: boolean
    full: boolean
}>(), {
    center: () => [50.5, 4.5],
    zoom: 7,
    height: "400px",
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    boundsMargin: 300,
})
const zoom = ref(props.zoom)
const initialCenter = computed<[number, number]>(() => props.center ?? [50.5, 4.5])
const currentQuery = ref(props.query)
const geoloc = useGeolocation()

const map = ref(null) 

/** Go to user location **/
async function centerOnUser() {
    const coordinates = await geoloc.request()
    coordinates && centerOn(coordinates.latitude, coordinates.longitude)
}

/** Go to location **/
async function centerOn(lat, lon) {
    if(map.value)
        map.value.setView([lat, lon], props.zoom ?? map.value.getZoom())
}

/** Refresh current location **/
function refreshQuery(map: LeafletMap) {
    if(!props.query || props.query.nearby)
        return

    const query = currentQuery.value
    const bounds = query?.bounds && getMapBounds(map)
    if(bounds && containsBounds(query.bounds, bounds))
        return

    currentQuery.value = {
        ...props.query,
        bounds: getExpandedBounds(map, props.boundsMargin),
    }
}

/** Debounced version of refreshQuery **/
const debouncedRefreshQuery = debounce(refreshQuery, 300)


// --- events
function onMapMove(event: {target: LeafletMap}) {
    if(!props.query.nearby)
        debouncedRefreshQuery(event.target)
}

async function onMapReady(instance: LeafletMap) {
    map.value = instance

    const coordinates = props.autoloc && await geoloc.autoRequest()
    coordinates && centerOn(coordinates.latitude, coordinates.longitude)
}

const exposed = {currentQuery, map, centerOn, centerOnUser}
defineExpose(exposed)
</script>

<template>
    <SmwQuery :query="currentQuery">
        <template #default="{ results, loading, error }">
            <div class="tw-content-map" :style="{ height }">
                <v-slot name="prepend" :results="results" :loading="loading" v-bind="exposed"></v-slot>
                <div class="tw-content-map-map" :style="{height}">
                    <LMap v-model:zoom="zoom" :center="initialCenter"
                            @ready="onMapReady"
                            @moveend="onMapMove" @zoomend="onMapMove">
                        <LTileLayer :url="props.tileUrl" :attribution="props.attribution" layer-type="base" name="Map" />
                        <v-slot name="default" :results="results" :loading="loading" v-bind="exposed"></v-slot>
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
                        <LControl v-if="props.full" position="bottomright">
                            <v-btn
                                class="content-map-location"
                                icon="mdi-crosshairs-gps"
                                size="x-small"
                                variant="elevated" color="seconday"
                                :loading="locationLoading"
                                aria-label="Centrer sur ma position"
                                @click="centerOnUser"
                            />
                        </LControl>
                    </LMap>
                    <v-slot name="append" :results="results" :loading="loading" v-bind="exposed"></v-slot>
                </div>
                <v-progress-linear v-if="loading" indeterminate class="tw-loading" />
            </div>
        </template>
    </SmwQuery>
</template>
<style>
.tw-content-map {
    position: relative;
}

.tw-content-map .tw-content-map-list {
    position: absolute;
    top: 0px;
    min-width: 300px;
    height: 100%;
    width: 50%;
}

.tw-content-map .tw-loading {
    position: absolute;
    z-index:1000;
}
</style>
