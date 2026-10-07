import { createApp, h, type Component, type VNode } from "vue"

import ContentMap from './components/ContentMap.vue'
import ContentList from './components/ContentList.vue'
import ModelList from './components/ModelList.vue'
import SmwQuery from './components/SmwQuery.vue'
import PlaceInput from './components/PlaceInput.vue'
import PlaceSearch from './components/PlaceSearch.vue'
import CoordinateInput from './components/CoordinateInput.vue'


/** Widgets registry mapping name to components **/
export const widgetsRegistry = {
    SmwQuery, ContentMap, ContentList, ModelList, PlaceInput,
    PlaceSearch, CoordinateInput,
}


export function setGlobals(app) {
    app.config.globalProperties.$location = window.location
    app.config.globalProperties.$weaverModels = window.weaverModels
}

export function initWidgets(vuetify: unknown, root: ParentNode = document) {
    const widgets = Array.from(root.querySelectorAll<HTMLElement>("[data-widget]"))
        .filter(element => !element.parentElement?.closest("[data-widget]"))

    for(const element of widgets) {
        const vnode = createWidgetVNode(element)

        if(!vnode)
            continue

        const app = createApp({
            setup: () => () => vnode,
        })

        setGlobals(app)
        app.use(vuetify)
        app.mount(element)
    }
}


function parseProps(element: HTMLElement): Record<string, unknown> {
    if(!element.dataset.props)
        return {}

    try {
        return JSON.parse(element.dataset.props)
    }
    catch(error) {
        console.error(`Error parsing properties of ${element.dataset.widget}:`, error)
        return {}
    }
}

function createNodeVNode(node: Node): VNode | string | null {
    if(node.nodeType === Node.TEXT_NODE)
        return node.textContent ?? ""

    if(node.nodeType !== Node.ELEMENT_NODE)
        return null

    const element = node as HTMLElement
    const widget = element.dataset.widget

    if(widget)
        return createWidgetVNode(element, widget)

    const props: Record<string, string> = {}

    for(const attribute of Array.from(element.attributes))
        if(attribute.name !== "data-slot")
            props[attribute.name] = attribute.value

    const children = Array.from(element.childNodes)
        .map(createNodeVNode)
        .filter((child): child is VNode | string => child !== null)

    return h(element.tagName.toLowerCase(), props, children)
}

function createSlotNodes(nodes: Node[]): VNode | string | null {
    return nodes.map(createNodeVNode).filter((node): node is VNode | string => node !== null)
}

function createWidgetVNode(element: HTMLElement, name = element.dataset.widget): VNode | null {
    if(!name)
        return null

    const component = widgetsRegistry[name]

    if(!component) {
        console.warn(`The widget ${name} is not registered in widgetsRegistry.`)
        return null
    }

    const slots: Record<string, () => VNode[]> = { default: () => [] }

    for(const slot of element.querySelectorAll<HTMLElement>("[data-slot]")) {
        if(slot.closest("[data-widget]") !== element)
            continue

        const name = slot.dataset.slot
        if(!name)
            continue

        slots[name] = () => createSlotNodes(Array.from(slot.childNodes)) as VNode[]
    }

    const defaultNodes = Array.from(element.childNodes)
        .filter(node => !(node instanceof HTMLElement && node.hasAttribute("data-slot")))

    slots.default = () => createSlotNodes(defaultNodes) as VNode[]

    return h(component, parseProps(element), slots)
}
