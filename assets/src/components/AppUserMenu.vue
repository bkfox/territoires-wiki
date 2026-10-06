<script setup lang="ts">
import WikiPortletsMenu from './WikiPortletsMenu.vue'

const {portlets, user} = defineProps({
    portlets: Array,
    user: Object,
})

const urls = {
    invitesignup: mw.util.getUrl('Special:InviteSignup'),
    invitelink: mw.util.getUrl('Special:GenerateInvite'),
}

</script>
<template>
    <wiki-portlets-menu nav :portlets="portlets"
            icon="mdi-account" title="User Account">
        <template #append>
            <v-list-item title="Tools" prepend-icon="mdi-hammer-wrench" append-icon="mdi-menu-right">
                <v-menu :open-on-focus="false" activator="parent" open-on-hover submenu>
                    <v-list>
                        <v-list-item v-if="user.permissions.invitesignup"
                            title="Invite people" :href="urls.invitesignup"
                            prepend-icon="mdi-account-plus" />
                        <v-list-item v-if="user.permissions.invitelink"
                            title="New invitation link" :href="urls.invitelink"
                            prepend-icon="mdi-account-multiple-plus" />
                    </v-list>
                </v-menu>
            </v-list-item>
        </template>
    </wiki-portlets-menu>
</template>
