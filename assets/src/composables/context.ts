import { computed, inject, provide, ref, onMounted } from 'vue';
    
export function getContext() {
    const config = window.mw.config
    const wgData = config.get("wgTerritoiresWikiData")

    return {
        user: {
            name: config.get('wgUserName'),
            groups: config.get('wgUserGroups'),
        },
        categories: config.get("wgCategories"),
        action: config.get("wgAction"),
        ...wgData
    }
}

export function provideContext() {
    const context = ref({})
    provide("context", context)

    onMounted(() => {
        if(window.mw && window.mw.config.exists('wgTerritoiresWikiData'))
            context.value = getContext()
    })
    return context
}


export function getPortlets(context, key, ...names) {
    return computed(() => {
        const portlets = context.value?.[key]
        if(!names.length)
            return portlets || []
        
        return portlets ?
            names.filter(name => portlets[name]).map(name => portlets[name])
            : []
    })
}

export function isCurrentPage(href) {
    const location = window.location
    if (!href || !location)
        return false;

    try {
        const currentUrl = new URL(location.href);
        const targetUrl = new URL(href, location.origin);

        if (targetUrl.pathname === currentUrl.pathname)
            return targetUrl.search === currentUrl.search;
    } catch (e) {
        return location.pathname + location.search === href;
    }

    return false;
};
