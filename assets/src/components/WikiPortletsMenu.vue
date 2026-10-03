<template>
    <v-menu v-if="!isEmpty" transition="scale-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind:="props"
                :prepend-icon="label && icon"
                :icon="icon"
                :text="label"
                :color="attrs.color || 'primary'"
                :title="title || label || ''"/>
        </template>
        <wiki-portlets-list :portlets="portlets" v-bind="attrs" />
    </v-menu>
</template>
<script setup>
import { computed, useAttrs } from 'vue'

import WikiPortletsList from './WikiPortletsList.vue'

const attrs = useAttrs()
const {icon, title, label, portlets} = defineProps({
    icon: String,
    title: String,
    label: String,
    portlets: Object,
})

const isEmpty = computed(() => !portlets?.filter(p => p.items?.length).length)
</script>
