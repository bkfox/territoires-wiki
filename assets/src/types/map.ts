export interface MapIcon {
    url: string
    size?: readonly [ width: number, height: number, ]
    anchor?: readonly [ x: number, y: number, ]
    popupAnchor?: readonly [ x: number, y: number, ]
}

export interface MapIconMapping {
    default?: MapIcon

    categories?: Record< string, MapIcon >

    pages?: Record< string, MapIcon >
}
