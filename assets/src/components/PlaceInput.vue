<script setup lang="ts">
import { ref, watch } from "vue"

import CoordinateInput from "./CoordinateInput.vue"
import PlaceSearch from "./PlaceSearch.vue"

import { useNominatim } from "@/composables/geocoding/useNominatim"

import type {
    Coordinates,
    Geocoder,
    GeocodingResult,
} from "@/types/geocoding"
import type { Place } from "@/types/place"

interface Props {
    geocoder?: Geocoder
    zoom?: number
    height?: number | string
    coordinatesField?: string
    addressField?: string
}

const props = withDefaults(defineProps<Props>(), {
    zoom: 13,
    height: 400,
})

const place = defineModel<Place>({
    default: () => ({
        address: "",
        country: "",
    }),
})

const geocoder = props.geocoder ?? useNominatim()

const address = ref(place.value.address)
const country = ref(place.value.country)
const coordinates = ref(place.value.coordinates)
const selected = ref<GeocodingResult | null>(null)

watch(
    () => place.value.address,
    value => {
        if (value !== address.value)
            address.value = value
    },
)

watch(
    () => place.value.country,
    value => {
        if (value !== country.value)
            country.value = value
    },
)

watch(
    () => place.value.coordinates,
    value => {
        if (!sameCoordinates(value, coordinates.value))
            coordinates.value = value
    },
)

watch(address, value => {
    if (value !== place.value.address)
        place.value = { ...place.value, address: value }
})

watch(country, value => {
    if (value !== place.value.country)
        place.value = { ...place.value, country: value }
})

watch(selected, result => {
    if (result) {
        address.value = result.displayName
        coordinates.value = result.coordinates
    }
})

watch(coordinates, value => {
    if (!sameCoordinates(value, place.value.coordinates))
        place.value = { ...place.value, coordinates: value }
})

async function selectCoordinates( value: Coordinates | undefined ): Promise<void> {
    coordinates.value = value

    if (!value) {
        selected.value = null
        return
    }

    const result = await geocoder.reverse(value)
    if (!result) {
        selected.value = null
        return
    }

    selected.value = result
}

function sameCoordinates( first: Coordinates | undefined, second: Coordinates | undefined, ): boolean {
    return (
        first?.[0] === second?.[0]
        && first?.[1] === second?.[1]
    )
}
</script>

<template>
    <div class="place-input">
        <!-- <v-text-field
            v-model="country"
            label="Pays"
            hide-details="auto"
        /> -->

        <PlaceSearch
            v-model="address" :name="props.addressField"
            v-model:selected="selected"
            :country="country"
            :geocoder="geocoder"
        />

        <CoordinateInput
            v-model="coordinates" :name="props.coordinatesField"
            :zoom="props.zoom"
            :height="props.height"
            @update:model-value="selectCoordinates"
        />
    </div>
</template>
