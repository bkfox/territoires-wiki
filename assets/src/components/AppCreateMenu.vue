<script setup lang="ts">
import {ref, useAttrs} from 'vue'
import ModelList from './ModelList.vue'

const attrs = useAttrs()
const props = defineProps({
    user: Object
})

const showDialog = ref(false)
const item = ref(null)
const title = ref(null)

function onSelect(event) {
    item.value = event.id
    showDialog.value = true
}

function createPage() {
    window.location.href = (
        window.mw.util.getUrl("Special:AddPage") +
        '&form=' + item.value.name +
        `&page_name=` + escape(title.value)
    )
}

function reset() {
    item.value = null
    title.value = null
    showDialog.value = false
}
</script>
<template>
    <v-menu v-if="user?.permissions?.createPage" v-bind="attrs">
        <template #activator="{props}">
            <v-btn v-bind="props" icon="mdi-note-plus" color="primary"
                title="Create a new page"/>
        </template>

        <v-list v-bind="attrs" return-object @click:select="onSelect">
            <model-list ns="Form" no-link />
        </v-list>
    </v-menu>
    <v-dialog max-width="500" v-if="item" v-model="showDialog" @afterLeave="reset">
        <v-card :title="item.label">
            <v-card-text>
                <small>{{ item.description }}</small>
                <v-text-field v-model="title" placeholder="Page title"
                    @keydown.enter="createPage"/>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn text="Cancel" @click="reset()" />
                <v-btn text="Create" color="primary"
                    @click="createPage()"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
