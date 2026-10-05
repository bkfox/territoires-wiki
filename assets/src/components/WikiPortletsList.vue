<template>
    <template v-for="portlet of props.portlets">
        <template v-if="portlet.items">
           <v-list-subheader v-if="props.showTitle || portlets.length > 1 && portlet.label">{{ portlet.label }}</v-list-subheader>
           <v-list-item 
               v-for="(item, index) in portlet.items" 
               :key="index"
               :active="props.nav && isCurrentPage(item.href)"
               :href="item.href"
               :title="item.text"
               :prepend-icon="!props.noIcons && getMdiIcon(item.icon)"
               />
       </template>
   </template>
</template>
<script setup>
import {getMdiIcon} from '@/composables/icons'
import {isCurrentPage} from '@/composables/context'
import WikiIcon from './WikiIcon.vue'

const props = defineProps({
    portlets: Array,
    nav: {type: Boolean},
    showTitle: Boolean,
    noIcons: {type: Boolean},
})
</script>
