<template>
    <v-app>
        <ox-nav :home="props.home" :logo="props.logo" :items="props.menu"/>
        <v-main>
            <v-dialog v-model="viewer.active" width="90%" height="80%" scrollable 
                    scroll-strategy="none" class="d-flex flex-column"
                    >
                <v-card>
                    <v-card-text>
                        <div class="position-relative h-100">
                            <v-carousel v-model="viewer.src" height="100%"
                                    :show-arrows="viewer.images.length>1"
                                    direction="vertical"
                                    vertical-arrows="left"
                                    vertical-delimiters="right"
                                    >
                                <v-carousel-item v-for="img in viewer.images"
                                    :key="img" :value="img" :src="viewer.src"/>
                            </v-carousel>
                        </div>
                        <v-spacer/>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="error" prepend-icon="mdi-close"
                                title="Close" @click="viewer.active=false">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <main ref="content" v-html="props.content" @click="onClick" />
        </v-main>
    </v-app>
</template>
<script setup>
import { computed, ref, reactive, onMounted, watch } from 'vue'

import OxNav from './OxNav'

const props = defineProps({
    home: String,
    logo: String,
    menu: Array,
    category: Object,
    content: String,
})
const content = ref(null)


const viewer = reactive({
    active: false,
    src: null,
    images: [],

    go(dir) {
        if(!this.images.length)
            return

        let idx = this.images.indexOf(this.src) + dir
        idx = this.normPosition(idx)

        this.src = this.images[idx]
        this.scrollToSource(this.src)
    },

    normPosition(idx) {
        if(idx < 0)
            return this.images.length-1
        else if(idx >= this.images.length)
            return 0
        return idx
    },

    scrollToSource(src) {
        const img = [...content.value.querySelectorAll('img:not(.no-viewer')].find(img => img.src == src)
        console.log(img)
        img?.scrollIntoView({ block: "center" })
    },
})


function onClick(event) {
    const target = event.target
    if(target.nodeName == 'IMG' && !event.target.classList.contains('no-viewer')) {
        viewer.src = event.target.src
        viewer.active = true
    }
}

function onContent(content) {
    const dom = document.createElement("div")
    dom.innerHTML = content

    viewer.images = [...dom.querySelectorAll('img:not(.no-viewer)')].map(i => i.src)
}

watch(() => viewer.src, (src) => viewer.active && viewer.scrollToSource(src))
onMounted(() => onContent(props.content))
</script>
