<script setup lang="ts">
import { computed, ref } from "vue"

import SmwQuery from "./SmwQuery.vue"
import type { SmwQueryOptions } from "@/types/smw"

const props = withDefaults(defineProps<{
    query: SmwQueryOptions
}>(), {})
</script>
<template>
    <SmwQuery :query="query">
        <template #default="{ results, loading, error }">
            <v-list>
                <template v-for="item in results">
                    <v-list-item>
                        <v-list-item-title><a :href="item.url">{{ item.title }}</a></v-list-item-title>
                        <p v-if="item.extract">{{ item.extract }}</p>
                    </v-list-item>
                </template>
            </v-list>
        </template>
    </SmwQuery>
</template>
