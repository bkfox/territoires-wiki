<template>
    <v-app>
        <v-app-bar class="app-bar bg" elevation="2" role="menu" scroll-behavior="hide">
            <v-app-bar-nav-icon variant="text" title="Navigation" color="primary"
                @click.stop="drawer = !drawer"/>
            <v-app-bar-title href="/">{{ context.siteName }}</v-app-bar-title>
            <v-spacer></v-spacer>
          
            <!-- Affichage des indicateurs de métadonnées sous forme de puces Vuetify -->
            <!-- <v-chip
              v-for="indicator in wikiData.indicators"
              :key="indicator.id"
              class="ma-1"
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-map-marker"
            >
              {{ indicator.text }}
            </v-chip> -->

            <search-field
                color="primary" variant="outlined" hide-details
                placeholder="Search"
                density="compact" style="max-width:20rem" />
            <template #append>
                <wiki-portlets-menu nav :portlets="notificationsPortlets"
                    icon="mdi-bell" title="Notifications" />
                <wiki-portlets-menu nav :portlets="userPortlets"
                    icon="mdi-account" title="User Account" />
                <app-settings-menu />
            </template>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app>
            <wiki-portlets-list nav :portlets="navPortlets"
                icon="mdi-menu" title="Navigation" show-title>
                <template #prepend>
                    <template v-if="context?.toc">
                        <app-toc :toc="context.toc" />
                    </template>
                </template>
            </wiki-portlets-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class="pa-6 mw-body" id="content" role="main">
                <h1 id="firstHeading" class="text-h4 mb-4 font-weight-bold mw-first-heading">
                    <template v-if="!context.page?.isMainPage">
                        {{ context.page?.title }}
                    </template>

                    <small class="float-right">
                        <wiki-portlets-menu :portlets="pagePortlets"
                            icon="mdi-plus" title="This page" variant="text"
                            no-icons />
                    </small>
                </h1>

                <wiki-infobox v-if="hasInfobox" :source="pageInfoBox" class="float-right" />

                <div ref="contentTarget" id="vue-content-portal"></div>

                <v-chip-group v-if="context.page?.categories" class="float-right">
                    <v-chip
                        v-for="category in context.page.categories"
                        :key="category"
                        color="primary"
                        variant="tonal"
                        icon="mdi-tag-outline"
                        :href="getCategoryUrl(category)"
                        >
                        {{ category }}
                    </v-chip>
                </v-chip-group>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

import {provideContext, getPortlets} from '@/composables/context'
import {useAutoLocate} from '@/composables/useGeolocation'

import AppToc from './AppToc.vue'
import WikiPortletsMenu from './WikiPortletsMenu.vue'
import WikiPortletsList from './WikiPortletsList.vue'
import WikiInfobox from './WikiInfobox.vue'
import ContentMap from './ContentMap.vue'
import AppSettingsMenu from './AppSettingsMenu.vue'
import SearchField from './SearchField.vue'

const drawer = ref(false)
const contentTarget = ref(null)
const hasInfobox = ref(false)

// --- composables
const context = provideContext()
const navPortlets = getPortlets(context, "nav", "portlets-first")
const pagePortlets = getPortlets(context, "portlets", "views", "actions", "namespaces")
const notificationsPortlets = getPortlets(context, "portlets", "notifications")
const userPortlets = getPortlets(context, "portlets", "user-menu")

const {autoLocate} = useAutoLocate()

// --- Logic
const pageInfoBox = "#bodyContent > section > div > #infobox"

onMounted(async () => {
  const originalContent = document.getElementById('mediawiki-raw-holder');
  if (originalContent && contentTarget.value) {
    originalContent.style.display = 'block';
    contentTarget.value.appendChild(originalContent);
  }

  hasInfobox.value = !!contentTarget.value.querySelector(pageInfoBox)
  if (window.mw && window.mw.hook)
    window.mw.hook('wikipage.content').fire($('#bodyContent'));
});

const getCategoryUrl = (categoryName) => {
  return window.mw.util.getUrl('Category:' + categoryName);
};
</script>

