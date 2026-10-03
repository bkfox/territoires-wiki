<script setup lang="ts">
import { watch } from "vue"
import { useSmwQuery } from "@/composables/useSmwQuery"
import type { SmwQueryOptions } from "@/types/smw"

const props = defineProps<{ query: SmwQueryOptions }>()
const emit = defineEmits<{ error: [error: Error] }>()

const { results, loading, error, hasMore, search } = useSmwQuery()

async function reload() {
    try {
        await search(props.query)
    } catch (error) {
        emit("error", error instanceof Error ? error : new Error(String(error)))
    }
}

watch(() => props.query, reload, { immediate: true, deep: true })

defineExpose({ reload })
</script>

<template>
    <slot :results="results" :loading="loading" :error="error" :has-more="hasMore" :reload="reload" />
</template>
