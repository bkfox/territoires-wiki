<script setup lang="ts">
import { computed, ref, useAttrs } from "vue"
import {debounce} from "lodash-es"

interface SearchItem {
    title: string
    url: string
    thumbnail?: string
    create?: boolean
}

interface SearchResponse {
    pages: Array<{
        id: number
        title: string
    }>
}

const attrs = useAttrs()
const api = new mw.Rest()

const search = ref("")
const searchUrl = computed(() => search.value && mw.util.getUrl(search.value))
const loading = ref(false)
const items = ref<SearchItem[]>([])

const searchPages = debounce(async (value: string): Promise<void> => {
    const query = value.trim()

    if (!query) {
        items.value = []
        return
    }

    search.value = query
    loading.value = true

    try {
        const data = await api.get<SearchResponse>(
            "/v1/search/title",
            {
                q: query,
                limit: 10,
            },
        )

        items.value = data.pages.map(page => ({
            title: page.title,
            url: mw.util.getUrl(page.title),
            thumbnail: page.thumbnail
        }))

        const exactMatch = data.pages.some(
            page => page.title.toLowerCase() === query.toLowerCase(),
        )

        if (!exactMatch) {
            items.value = [
                {
                    title: query,
                    url: mw.util.getUrl(query, { action: "edit", }),
                    create: true,
                },
                ...items.value
            ]
        }
    }
    catch(error) {
        console.error("Unable to search pages:", error)
        items.value = []
    }
    finally {
        loading.value = false
    }
}, 300)

function openArticle(query: SearchItem | string | null): void {
    if (!query)
        return

    if (typeof query !== "string")
        query = query.url

    window.location.href = query
}
</script>
<template>
    <v-autocomplete
        v-bind="attrs"
        v-model:search="search"
        append-inner-icon="mdi-magnify"
        :items="items"
        :loading="loading"
        item-title="title"
        item-value="url"
        menu-icon=""
        return-object
        auto-select-first
        @update:search="searchPages"
        @update:model-value="openArticle"
    >
        <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :title="item.raw.title"
                    :active="search.toLowerCase() == item.raw.title.toLowerCase()">
                <template #prepend>
                    <v-avatar v-if="item.raw.thumbnail" rounded="0" >
                        <v-img :src="item.raw.thumbnail" />
                    </v-avatar>
                    <v-icon v-else-if="item.raw.create" icon="mdi-plus" />
                </template>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>
