import { ref, computed } from "vue"
import type { Coordinates } from "@/types/smw"

const STORAGE_KEY = "tw.settings.geo.autoloc"

/** User geolocation **/
const position = ref<Coordinates>()
/** Whether geolocation is loading **/
const loading = ref(false)
/** Error fetching geolocation **/
const error = ref<GeolocationPositionError>()
/** User auto-location settings. **/
const autoLocateValue = ref<null|boolean>(readAutoLocate())
/** Autolocation as computed value **/
const autoLocate = computed({
    get() { return autoLocateValue.value },
    set(value) { setAutoLocate(value) }
})

let requested = false


/** Return autolocation from storage **/
function readAutoLocate(): null|boolean {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === null ? null : stored === "true"
}

/** Set geo autolocalisation setting **/
export function setAutoLocate(enabled: boolean) {
    autoLocateValue.value = enabled
    localStorage.setItem(STORAGE_KEY, String(enabled))
}

/** Request and return user location. **/
export async function request(): Promise<Coordinates | undefined> {
    if (!navigator.geolocation)
        return undefined

    if (requested && position.value)
        return position.value

    requested = true
    loading.value = true
    error.value = undefined

    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            result => {
                position.value = {
                    latitude: result.coords.latitude,
                    longitude: result.coords.longitude,
                }
                loading.value = false
                resolve(position.value)
            },
            result => {
                error.value = result
                loading.value = false
                resolve(undefined)
            },
        )
    })
}

/** Request user location if auto-locate is enabled. **/
async function autoRequest(): Promise<Coordinates | undefined> {
    if(autoLocate.value)
        return request()
    return undefined
}


/** Use autolocate settings. */
export function useAutoLocate() {
    return { autoLocate, autoRequest }
}

/**
 * Return geolocation tools.
 * 
 * @param{Boolean} autoLoc: call autoRequest.
 */
export function useGeolocation() {
    return { position, loading, autoLocate, error, request, autoRequest }
}
