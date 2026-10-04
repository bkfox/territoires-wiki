<template>
    <v-list-subheader v-if="props.toc?.['array-sections']?.length" title="Summary"/>
    <template v-for="item of props.toc['array-sections']">
        <v-list-group v-if="item['array-sections']?.length" :value="item.line">
            <template #activator="{props}">
                <v-list-item :title="item.line" v-bind="props" />
            </template>

            <template v-for="item, index of item['array-sections']" :key="index">
                <v-list-item v-if="item.linkAnchor" :href="'#' + item.linkAnchor">
                    {{ item.line }}
                </v-list-item>
            </template>
        </v-list-group>
        <v-list-item v-else-if="item.linkAnchor" :href="'#' + item.linkAnchor">
            {{ item.line }}
        </v-list-item>
    </template>
</template>
<script setup>
import {computed, useAttrs} from 'vue'

const props = defineProps({
    toc: Object,
})
const attrs = useAttrs()
</script>
