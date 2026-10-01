<template>
  <v-list open-strategy="multiple">
    <div v-for="(section, idx) in sidebarMenu" :key="idx">
      <!-- Section de navigation extensible (ex: Navigation, Outils) -->
      <v-list-group :value="section.title">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="section.title" class="text-subtitle-1 font-weight-bold"></v-list-item>
        </template>

        <!-- Liens internes de la section -->
        <v-list-item
          v-for="link in section.links"
          :key="link.text"
          :title="link.text"
          :href="link.href"
          link
          prepend-icon="mdi-link-variant"
        ></v-list-item>
      </v-list-group>
      <v-divider class="my-1"></v-divider>
    </div>
  </v-list>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sidebarMenu = ref([]);

onMounted(async () => {
  try {
    const api = new mw.Api();

    // 1. On demande à l'API de parser le contenu du message système "sidebar" 
    // généré par défaut par le cœur PHP de MediaWiki
    const response = await api.get({
      action: 'parse',
      text: '{{sidebar}}', // Utilise le mot-clé magique qui appelle le menu par défaut
      contentmodel: 'wikitext',
      format: 'json'
    });

    if (response.parse && response.parse.text) {
      const htmlContent = response.parse.text['*'];
      
      // 2. Extraction des liens depuis le HTML généré par MediaWiki
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Recherche des groupes de listes générés (souvent des éléments <ul> précédés par des titres)
      const sections = doc.querySelectorAll('.mw-portlet, .portal');
      const compiledMenu = [];

      sections.forEach(section => {
        const titleElement = section.querySelector('h3, .mw-portlet-title, label');
        const linksElements = section.querySelectorAll('ul li a');
        
        if (linksElements.length > 0) {
          const title = titleElement ? titleElement.textContent.trim() : 'Navigation';
          const links = Array.from(linksElements).map(a => ({
            text: a.textContent.trim(),
            href: a.getAttribute('href')
          }));

          compiledMenu.push({ title, links });
        }
      });

      // Si le parsing automatique n'a rien donné, on charge un menu de secours (Fallback)
      sidebarMenu.value = compiledMenu.length > 0 ? compiledMenu : getFallbackMenu();
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des menus :", err);
    sidebarMenu.value = getFallbackMenu();
  }
});

// Menu de secours si l'API est inaccessible ou vide (Wiki tout neuf)
const getFallbackMenu = () => {
  return [
    {
      title: 'Navigation',
      links: [
        { text: 'Accueil', href: mw.util.getUrl('Main_Page') },
        { text: 'Modifications récentes', href: mw.util.getUrl('Special:RecentChanges') },
        { text: 'Page au hasard', href: mw.util.getUrl('Special:Random') }
      ]
    },
    {
      title: 'Outils',
      links: [
        { text: 'Pages spéciales', href: mw.util.getUrl('Special:SpecialPages') }
      ]
    }
  ];
};
</script>

