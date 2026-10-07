<script setup lang="ts">
import { ref, watch } from "vue"
import debounce from "lodash-es/debounce"

import { useNominatim } from "@/composables/geocoding/useNominatim"
import { Geocoder } from "@/composables/useGeocoder"
import type { GeocodingResult } from "@/types/geocoding"
import { parseCoordinates } from '@/smw/geo'

interface Props {
    /** Input field name **/
    name?: string
    /** Search in this country **/
    country?: string
    /** Optional geocoder (default uses novatim) **/
    geocoder: Geocoder
    /** Selector to coordinate field **/
    coordinatesSelector?: string
}

const props = defineProps<Props>()
const geocoder = props.geocoder ?? useNominatim()

const address = defineModel<string>({ default: "" })
const selected = defineModel<GeocodingResult | null>("selected", {
    default: null,
})

const search = ref(address.value)
const results = ref<GeocodingResult[]>([])
const loading = ref(false)
const error = ref<string>()

const input = ref(null)

const searchGeocoder = debounce(async (query: string) => {
    query = query.trim()

    if (!query) {
        results.value = []
        return
    }

    loading.value = true
    error.value = undefined

    try {
        const searchQuery = props.country ? `${query}, ${props.country}` : query
        results.value = await geocoder.search(searchQuery)
    } catch (exception) {
        error.value = exception instanceof Error
            ? exception.message
            : String(exception)

        results.value = []
    } finally { loading.value = false }
}, 300)


async function reverseGeocode(coordinates: Coordinates): Promise<void> {
    try {
        const result = await geocoder.reverse(coordinates)
        if (!result)
            return

        selected.value = result
        address.value = result.displayName
    } catch (exception) {
        // Handle the error as currently done by PlaceSearch.
    }
}

watch(search, value => {
    if (value !== address.value)
        address.value = value
    searchGeocoder(value)
})

watch(address, value => {
    if (value !== search.value)
        search.value = value
})

watch(() => props.country, () => { searchGeocoder(search.value) })

watch(selected, (value) => {
    address.value = value.displayName

    const inputEl = input.value
    if(inputEl) {
        inputEl.value = value.displayName // force value change before event dispatch
        inputEl.dispatchEvent(new Event("change", { bubble: true }))
    }
})
</script>

<template>
    <input v-if="props.name" ref="input" type="hidden"
        :name="props.name" :value="selected" />
    <v-autocomplete
        v-model="selected"
        v-model:search="search"
        :items="results"
        item-title="displayName"
        return-object
        :loading="loading"
        :error-messages="error"
        label="Adresse"
        clearable
        hide-details="auto"
    />
</template>
