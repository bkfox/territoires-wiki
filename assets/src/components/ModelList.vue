<script setup lang="ts">
import {computed, useAttrs} from 'vue'

import {useModels} from '@/composables/weaver'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = defineProps({
    ns: String,
    noLink: Boolean,
    noInfo: Boolean,
})
const {models, getModelUrl} = useModels()
</script>
<template>
    <template v-for="item in models">
        <v-list-item
            :title="item.label" :subtitle="!props.noInfo && item.description || ''"
            :value="item" :prependIcon="item.getMdiIcon()"
            :href="!props.noLink && getModelUrl(item, ns)" />
    </template>
</template>
