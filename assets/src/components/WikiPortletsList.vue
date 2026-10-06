<template>
    <template v-for="portlet of props.portlets">
        <template v-if="portlet.items">
           <v-list-subheader v-if="props.showTitle || portlets.length > 1 && portlet.label">{{ portlet.label }}</v-list-subheader>
           <wiki-portlets-list-item
                v-for="item in getItems(portlet.items)"
                :item="item" :noIcon="props.noIcon" />
       </template>
   </template>
   <template v-if="'append' in slots">
        <v-divider/>
        <slot name="append" v-bind="props" />
   </template>

   <v-divider v-if="lastItems.length"/>
   <template v-for="item in lastItems">
        <wiki-portlets-list-item :item="item" :noIcon="props.noIcon" />
   </template>
</template>
<script setup>
import {computed, useSlots} from 'vue'
import WikiPortletsListItem from './WikiPortletsListItem.vue'

const props = defineProps({
    portlets: Array,
    nav: {type: Boolean},
    showTitle: Boolean,
    noIcon: {type: Boolean},
})
const slots = useSlots()
console.log(slots, !!slots.append)

const lastIds = new Set(['pt-logout'])
const lastItems = computed(() => {
    let items = []
    for(const portlet of props.portlets) {
        items = [
            ...items,
            ...portlet.items.filter(v => lastIds.has(v.id))
        ]
    }
    return items
})


function getItems(items) {
    if(lastItems.value.length)
        return items.filter(v => !lastIds.has(v.id))
    return items
}
</script>
