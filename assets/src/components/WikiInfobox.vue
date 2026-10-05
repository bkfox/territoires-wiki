<template>
    <v-card v-show="hasMap && fields.length" class="float-right ml-3"
            variant="outlined" width="300" max-width="300" :title="props.title">
        <div ref="mapTarget" class="wiki-native-map-portal"/>

        <v-list lines="two" density="compact">
            <template v-for="field of fields">
                <v-list-item v-if="field.value">
                    <template v-slot:prepend>
                        <b>{{ field.label }}</b>
                    </template>

                    <div v-html="field.value"/>
                </v-list-item>
                <v-list-subheader v-else>{{ field.label }}</v-list-subheader>
            </template>
        </v-list>
    </v-card>
</template>
<script setup>
import {computed, onMounted, ref, getCurrentInstance} from 'vue'

const props = defineProps({
    source: String
})

const mapTarget = ref(null)
const instance = getCurrentInstance()
const fields = ref([])
const hasMap = ref(false)

onMounted(() => {
    const el = document.querySelector(props.source)

    // init map
    const nativeMapContainer = el?.querySelector('.wiki-map-source-container');
    if (nativeMapContainer) {
        nativeMapContainer.style.display = 'block';
        mapTarget.value.appendChild(nativeMapContainer);
        hasMap.value = true
    }

    // data
    const rows = el.querySelectorAll('tr')
    const items = []
    let hasValues = false

    rows.forEach(row => {
        const label = row.querySelector('th:not(.infobox-title)')?.textContent.trim()
        const value = row.querySelector('td')
        const valueContent = value?.textContent.trim()
        
        if(!label || (value && !valueContent))
            return

        items.push({ label, value: valueContent })
        if(valueContent)
            hasValues=true
    })

    if(hasValues)
        fields.value = items
})
</script>
