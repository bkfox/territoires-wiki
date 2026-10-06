<template>
    <v-menu v-if="!isEmpty">
        <template #activator="{ props }">
            <v-btn v-bind="props"
                :prepend-icon="label && icon"
                :icon="icon"
                :text="label"
                :variant="variant"
                :color="attrs.color || 'primary'"
                :title="title || label || ''"/>
        </template>
        <v-list v-bind="listProps" nav>
            <wiki-portlets-list :portlets="portlets" v-bind="attrs">
                <template v-if="slots.append" #append="bound">
                    <slot name="append" v-bind="bound"/>
                </template>
            </wiki-portlets-list>
        </v-list>
    </v-menu>
</template>
<script setup>
import { computed, useAttrs, useSlots } from 'vue'

import WikiPortletsList from './WikiPortletsList.vue'

const attrs = useAttrs()
const {icon, title, label, portlets, variant, ...listProps} = defineProps({
    icon: String,
    title: String,
    label: String,
    variant: String,
    color: {type: String, default: 'primary'},
    portlets: Object,
})
const slots = useSlots()

const isEmpty = computed(() => !portlets?.filter(p => p.items?.length).length)
</script>
