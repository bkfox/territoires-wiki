<script setup lang="ts">
import { useAutoLocate } from '@/composables/useGeolocation'

const {autoLocate} = useAutoLocate()
</script>
<template>
    <v-menu :close-on-content-click="false">
        <template #activator="{props}">
            <v-btn icon="mdi-dots-vertical" color="primary" v-bind="props"/>
        </template>

        <v-list>
            <v-list-subheader>Interface</v-list-subheader>
            <v-list-item>
                <v-switch v-model="autoLocate" size="x-small" color="primary">
                    <template #label>
                        <div>
                            Get your location<br/>
                            <v-list-item-subtitle>
                                We don't store your location. It only is used within your browser.                       
                            </v-list-item-subtitle>
                        </div>
                    </template>
                </v-switch>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
