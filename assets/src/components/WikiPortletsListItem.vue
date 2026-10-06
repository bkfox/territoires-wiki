<script setup lang="ts">
import {getMdiIcon} from '@/composables/icons'
import {isCurrentPage} from '@/composables/context'

const {item, ...props} = defineProps({
    item: Object,
    noIcon: Boolean,
})
</script>
<template>
   <v-list-item v-if="item?.id || item?.href"
       :key="index"
       :id="item.id"
       :active="props.nav && isCurrentPage(item.href)"
       :href="item.href"
       :title="item.text"
       :prepend-icon="!props.noIcons && getMdiIcon(item.icon)"
       />
    <v-divider v-else/>
</template>
