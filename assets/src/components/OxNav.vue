<template>
    <v-app-bar class="app-bar bg" role="menu" scroll-behavior="hide">
        <v-app-bar-title>
            <a :href="props.home" aria-label="Home">
                <img :src="props.logo" class="logo" alt="Oxylus" />
            </a>
        </v-app-bar-title>
        <template #append>
            <template v-for="item of items">
                <v-btn v-if="item.url" class="menu-item"
                        variant="text" color="primary"
                        :href="item.url" :active="item.active">
                    {{ item.text }}
                </v-btn>
                <ox-nav-list v-else-if="item.items" v-bind="item" class="menu-item" />
            </template>
            <ox-nav-list class="menu-list" icon="mdi-menu"
                :items="props.items"/>
        </template>
    </v-app-bar>
</template>
<script setup>
import { computed } from 'vue'
import {navSort} from '../composables'
import OxNavList from './OxNavList'
    
const props = defineProps({
    home: String,
    logo: String,
    items: Array,
})
const items = computed(() => navSort(props.items))

</script>
<style scoped>

@media screen and (min-width: 800px) {
    .menu-list { display: none; }
}
@media screen and (max-width: 800px) {
    .menu-item { display: none; }
}

.logo {
    max-height: calc(64px - 1rem);
}

ul {
    display: flex;
    flex-direction: row;
    align-items: center;
}

ul li {
    list-style-type: none;
    padding: 1rem;
    margin-left: unset;
}
</style>
