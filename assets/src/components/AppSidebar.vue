<script setup lang="ts">
import {useAttrs} from 'vue'

import {useModels} from '@/composables/weaver'

import WikiPortletsList from './WikiPortletsList.vue'
import AppToc from './AppToc.vue'
import ModelList from './ModelList.vue'

defineOptions({inheritAttrs: false})

const props = defineProps({
    portlets: Object,
    toc: Array,
})
const attrs = useAttrs()
const {models, getModelUrl} = useModels()
</script>
<template>
    <v-navigation-drawer app v-bind="attrs">
        <v-list nav>
            <wiki-portlets-list nav :portlets="props.portlets"
                icon="mdi-menu" title="Navigation" show-title />

            <v-list-subheader>Explore</v-list-subheader>
            <model-list no-info />
        </v-list>
    </v-navigation-drawer>
</template>
