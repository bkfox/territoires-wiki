<template>
    <v-list :color="color" nav>
        <template v-for="portlet of portlets">
            <template v-if="portlet.items">
               <v-list-subheader v-if="portlets.length > 1 && portlet.label">{{ portlet.label }}</v-list-subheader>
               <v-list-item 
                   v-for="(item, index) in portlet.items" 
                   :key="index"
                   :active="nav && isCurrentPage(item.href)"
                   :href="item.href"
                   :title="item.text"
                   :prepend-icon="!noIcons && getMdiIcon(item.icon)"
                   />
           </template>
       </template>
    </v-list>
</template>
<script setup>
import {getMdiIcon} from '@/composables/icons'
import {isCurrentPage} from '@/composables/context'
import WikiIcon from './WikiIcon.vue'

const {color, noIcons, nav, portlets} = defineProps({
    portlets: Array,
    nav: {type: Boolean},
    noIcons: {type: Boolean},
    color: {type: String, default: 'primary'},
})
</script>
