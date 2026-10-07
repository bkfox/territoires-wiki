<script setup lang="ts">
import { ref, watch } from "vue"
import { LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet"

import type { Coordinates } from "@/types/geocoding"

interface Props {
    /** Input field name **/
    name?: string
    /** Map zoom **/
    zoom?: number
    /** Map height **/
    height?: number | string
    /** Address selector to sync with **/
    addressSelector?: string
}

const props = withDefaults(defineProps<Props>(), {
    zoom: 13,
    height: 400,
})

const coordinates = defineModel<Coordinates>()
const center = ref<Coordinates>(coordinates.value ?? [48.8566, 2.3522])
const input = ref(null)

watch(coordinates, value => {
    if (!value)
        return

    center.value = value

    const inputEl = input.value
    if(inputEl) {
        inputEl.value = value.join(', ')
        inputEl.dispatchEvent(new Event("change", { bubble: true }))
    }
})

function setCoordinates( latitude: number, longitude: number, ): void {
    coordinates.value = [latitude, longitude]
}
</script>

<template>
    <div class="coordinate-input">
        <input v-if="props.name" type="hidden"
            :name="props.name" :value="coordinates?.join(', ') || ''" />
        <LMap
            :zoom="props.zoom"
            :center="center"
            :style="{ height: `${props.height}px` }"
            @click="
                setCoordinates(
                    $event.latlng.lat,
                    $event.latlng.lng,
                )
            "
        >
            <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            <LMarker
                v-if="coordinates"
                :lat-lng="coordinates"
                draggable
                @update:lat-lng="
                    setCoordinates($event.lat, $event.lng)
                "
            />
        </LMap>
    </div>
</template>
