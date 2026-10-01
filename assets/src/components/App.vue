<template>
  <v-app>
    <!-- Topbar Vuetify -->
    <v-app-bar class="app-bar bg" elevation="2" role="menu" scroll-behavior="hide">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
      <v-app-bar-title>{{ wikiData.siteName }}</v-app-bar-title>
      <v-spacer></v-spacer>
      
      <!-- Affichage des indicateurs de métadonnées sous forme de puces Vuetify -->
      <v-chip
        v-for="indicator in wikiData.indicators"
        :key="indicator.id"
        class="ma-1"
        color="secondary"
        variant="tonal"
        prepend-icon="mdi-map-marker"
      >
        {{ indicator.text }}
      </v-chip>
      
      <wiki-menu-user></wiki-menu-user>
    </v-app-bar>

    <!-- Sidebar Vuetify -->
    <v-navigation-drawer v-model="drawer" app>
      <wiki-sidebar></wiki-sidebar>
    </v-navigation-drawer>

    <!-- Zone principale -->
    <v-main>
      <v-container fluid class="pa-6">
        
        <!-- Titre de la page rendu via du texte pur réactif -->
        <h1 class="text-h4 mb-4 font-weight-bold">{{ wikiData.pageTitle }}</h1>
        
        <!-- Le cœur vivant de MediaWiki (Téléporté pour préserver OOUI & Maps) -->
        <div ref="contentTarget" id="vue-content-portal"></div>
        
        <!-- Zone des catégories stylisée avec des v-chip de Vuetify -->
        <v-sheet v-if="wikiData.categories.length > 0" class="mt-8 pa-4" rounded variant="outlined">
          <div class="text-subtitle-2 mb-2 text-grey-darken-1">Catégories de la page :</div>
          <v-chip-group>
            <v-chip
              v-for="category in wikiData.categories"
              :key="category"
              color="primary"
              variant="flat"
              prepend-icon="mdi-tag-outline"
              :href="getCategoryUrl(category)"
            >
              {{ category }}
            </v-chip>
          </v-chip-group>
        </v-sheet>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import WikiMenuUser from './WikiMenuUser.vue';
import WikiSidebar from './WikiSidebar.vue';

const drawer = ref(true);
const contentTarget = ref(null);

// Définition de notre structure de données réactive à plat
const wikiData = ref({
  siteName: '',
  pageTitle: '',
  isMainPage: false,
  categories: [],
  indicators: []
});

onMounted(async () => {
  // Récupération sécurisée du bloc JSON injecté par le PHP de MediaWiki
  if (window.mw && window.mw.config.exists('wgTerritoiresWikiData')) {
    wikiData.value = window.mw.config.get('wgTerritoiresWikiData');
  }

  await nextTick();

  // Téléportation propre du #bodyContent pour conserver l'interactivité d'OOUI / Maps
  const originalContent = document.getElementById('mediawiki-raw-holder');
  if (originalContent && contentTarget.value) {
    originalContent.style.display = 'block';
    contentTarget.value.appendChild(originalContent);
  }

  // Notification obligatoire au moteur de MediaWiki pour lier les scripts
  if (window.mw && window.mw.hook) {
    window.mw.hook('wikipage.content').fire($('#bodyContent'));
  }
});

// Génération du lien vers la page de la catégorie
const getCategoryUrl = (categoryName) => {
  return window.mw.util.getUrl('Category:' + categoryName);
};
</script>

