<template>
  <v-app>
    <v-app-bar class="app-bar bg" elevation="2" role="menu" scroll-behavior="hide">
      <template #prepend>
            <wiki-portlets-menu nav :portlets="navPortlets"
                icon="mdi-menu" title="Navigation" />
      </template>
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

      <wiki-portlets-menu :portlets="notificationsPortlets"
          icon="mdi-bell" title="Notifications" />
      <wiki-portlets-menu :portlets="userPortlets"
          icon="mdi-account" title="User Account" />
      <app-settings-menu />
    </v-app-bar>

    <!-- Sidebar Vuetify -->
    <!--
    <v-navigation-drawer v-model="drawer" app>
      <wiki-sidebar></wiki-sidebar>
    </v-navigation-drawer>
    -->

    <!-- Zone principale -->
    <v-main>
      <v-container fluid class="pa-6 mw-body" id="content" role="main">
        
        <h1 id="firstHeading" class="text-h4 mb-4 font-weight-bold mw-first-heading">
            {{ context.page?.title }}

            <wiki-portlets-menu :portlets="pagePortlets"
                icon="mdi-dots-vertical" title="This page" variant="text"
                no-icons />
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

import WikiPortletsMenu from './WikiPortletsMenu.vue'
import WikiInfobox from './WikiInfobox.vue'
import ContentMap from './ContentMap.vue'
import AppSettingsMenu from './AppSettingsMenu.vue'

const drawer = ref(true)
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

