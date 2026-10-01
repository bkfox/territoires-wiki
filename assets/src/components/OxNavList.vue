<template>
    <v-menu v-bind="menuProps"  :close-on-content-click="false">
        <template v-if="!props.nested" v-slot:activator="{ props: bindProps }">
            <v-btn
                v-bind="{...attrs, ...bindProps}"
                :text="props.text"
                :icon="props.text ? null : props.icon"
                :prepend-icon="!props.text ? null : props.icon"
                :aria-label="props.text"
                color="primary" variant="text" />
        </template>

        <v-list>
            <template v-for="item of items">
                <v-list-item v-if="item.url" :href="item.url" :active="item.active">
                    {{ item.text }}
                </v-list-item>
                <v-list-group v-else-if="item.items" :value="item.text">
                    <template #activator="{props}">
                        <v-list-item :title="item.text" v-bind="props" />
                    </template>

                    <template v-for="item, index of item.items" :key="index">
                        <v-list-item v-if="item.url" :href="item.url" :active="item.active">
                            {{ item.text }}
                        </v-list-item>
                    </template>
                </v-list-group>
            </template>
        </v-list>
    </v-menu>
</template>
<script setup>
import {computed, useAttrs} from 'vue'
import {navSort} from '../composables'

const props = defineProps({
    text: String,
    icon: String,
    items: Array,
    nested: Boolean
})
const attrs = useAttrs()

const menuProps = computed(() => (
    props.nested
        ? {
            openOnFocus: false,
            activator: "parent",
            openOnHover: true,
            submenu: true
        }
        : {}
))
const items = computed(() => navSort(props.items))
</script>
<style scoped>

@media screen and (min-width: 800px) {
    .menu-list { display: none; }
}
@media screen and (max-width: 800px) {
    .menu-item { display: none; }
}
</style>
