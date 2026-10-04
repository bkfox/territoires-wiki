<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps({
    models: Array,
})


function getLabel(item) { return item.category?.label || item.label }
function getUrl(item) { return window.mw.util.getUrl('Category:' + (item.category?.name || item.name)) }

const items = computed(() => {
    console.log(window.weaverModels)
    const items = [...(props.models || window.weaverModels || [])]
    items.sort((a, b) => getLabel(a) < getLabel(b) ? -1 :
                         getLabel(a) > getLabel(b) ? 1 : 0)
    return items
})

</script>
<template>
    <template v-for="item in items">
        <v-list-item :title="getLabel(item)" :subtitle="item.description"
            :href="getUrl(item)" />
    </template>
</template>
