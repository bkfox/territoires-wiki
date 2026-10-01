
export function navSort(items: any[]): any[] {
    if(!items)
        return []
    if(!items.some(x => typeof(x.order) == 'number'))
        return items

    items = [...items]
    items.sort((a, b) =>
        (typeof(a.order) == "number" && typeof(b.order) == "number")
            ? a.order - b.order
            : a.text < b.text ? -1
            : a.text == b.text ? 0 : 1
    )
    return items
}

