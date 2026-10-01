<template>
  <v-menu transition="scale-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind:="props" color="primary">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>
    
    <v-list min-width="200">
      <v-list-item 
        v-for="(item, index) in userLinks" 
        :key="index"
        :href="item.href"
        :title="item.text"
      >
        <template v-slot:prepend>
          <v-icon>{{ getIcon(item.id) }}</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userLinks = ref([]);

onMounted(() => {
  const userLinksData = mw.config.get('wgUserLinks') || [];
  const username = mw.config.get('wgUserName');
  if (username) {
    userLinks.value = [
      { id: 'userpage', text: username, href: mw.util.getUrl('User:' + username) },
      { id: 'preferences', text: 'Préférences', href: mw.util.getUrl('Special:Preferences') },
      { id: 'logout', text: 'Déconnexion', href: mw.util.getUrl('Special:UserLogout') }
    ];
  } else {
    userLinks.value = [
      { id: 'login', text: 'Connexion', href: mw.util.getUrl('Special:UserLogin') }
    ];
  }
});

const getIcon = (id) => {
  const icons = {
    userpage: 'mdi-account',
    preferences: 'mdi-cog',
    logout: 'mdi-logout',
    login: 'mdi-login'
  };
  return icons[id] || 'mdi-link';
};
</script>

