import { computed } from 'vue'

export function getModelUrl(item, ns: string|null='Category') {
    const name = ns ? `${ns}:${item.name}` : item.name
    return window.mw.util.getUrl(name) 
}

let modelsInitialized = false


class WeaverModel {
    constructor(data) {
        Object.assign(this, data)
    }

    getMdiIcon() {
        return this.mdiIcon && `mdi-${this.mdiIcon}`
    }
}


function initModels() {
    if(!modelsInitialized) {
        window.weaverModels = window.weaverModels.map(m => new WeaverModel(m))
        modelsInitialized = true
    }
}

/**
 * Use weaver models.
 */
export function useModels({sort=true,filter=null}={}) {
    const models = computed(() => {
        initModels()
            
        let items = [...(window.weaverModels || [])]
        if(filter)
            items = items.filter(filter)
        if(sort)
            items.sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0)

        return items
    })
    return {models, getModelUrl} 
}

