import { computed, ref } from "vue"
import type { CategoryDefinition } from "@/types/category"

interface CategoriesResponse {
    categories: CategoryDefinition[]
}

export function useCategories() {
    const categories = ref<CategoryDefinition[]>(
        getConfiguredCategories(),
    )
    const loading = ref(false)
    const error = ref<Error | null>(null)

    const byName = computed(() => new Map(
        categories.value.map(category => [category.name, category]),
    ))

    async function load(): Promise<void> {
        if (categories.value.length)
            return

        loading.value = true
        error.value = null

        try {
            const api = new mw.Api()

            const response = await api.get({
                action: "territoriescategories",
                format: "json",
                formatversion: 2,
            }) as CategoriesResponse

            categories.value = response.categories
        } catch (cause) {
            error.value = cause instanceof Error ? cause : new Error(String(cause))
        } finally {
            loading.value = false
        }
    }
    return { categories, byName, loading, error, load, }
}

function getConfiguredCategories(): CategoryDefinition[] {
    return mw.config.get("territoriesCategories") ?? []
}
