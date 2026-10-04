import { createApp, h, ref } from 'vue';
import { createVuetify } from 'vuetify';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { md3 } from 'vuetify/blueprints'
import colors from 'vuetify/util/colors'
import './index.scss';

import App from './components/App.vue';
import {initWidgets, setGlobals} from './widgets';


window.mw.loader.using(['mediawiki.api', 'mediawiki.util', 'ext.maps.leaflet.library'], function () {

    // Script déclenché à chaque chargement ou modification du contenu du wiki (Hook natif)
    /*mw.hook('wikipage.content').add(function (content) {
    // Si des modules tiers comme Maps (Leaflet) ou des infobulles ont besoin d'être rafraîchis :
    // MediaWiki s'en occupe automatiquement car nous avons isolé #bodyContent avec `v-pre`.
    });*/

    $(document).ready(function() {
        // On passe directement le composant App à createApp
        const app = createApp(App);

        const vuetify = createVuetify({
            blueprint: md3,
            theme: {
                themes: {
                    light: {
                        dark: false,
                        colors: {
                            primary: colors.green.darken1,
                            secondary: colors.green.lighten4
                        }
                    }
                }
            },
            defaults: {
                VTextField: { variant: 'underlined', },
                VSelect: { variant: 'underlined', },
                VTextarea: { variant: 'outlined', },
                VCombobox: { variant: 'underlined', },
                VAutocomplete: { variant: 'underlined', },
            },
        })

        setGlobals(app)
        app.use(vuetify);

        if (document.getElementById('app'))
            app.mount('#app');

        initWidgets(vuetify)
    });
});

