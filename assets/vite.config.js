/**
 * This is the base module that provide common configuration to compile with
 * Vite.
 */
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import commonjs from '@rollup/plugin-commonjs';


export const staticRoot = fileURLToPath(new URL('../static', import.meta.url))


// https://vitejs.dev/config/
export default defineConfig({
    base: '/skins/TerritoiresWikiSkin/assets/', 
    plugins: [
        vue(),
        vuetify({ autoImport: true }),
    ],
    build: {
        outDir: '../TerritoiresWikiSkin/assets',
        // sourcemap: true,
        sourcemap: "inline",
        emptyOutDir: true,
        manifest: true,
        cssCodeSplit: false,

        optimizeDeps: {
            include: ['vuetify'],
        },

        rollupOptions: {
            input: {
                index: "src/index.ts",
            },
            output: {
                format: 'iife',
                /*globals: {
                    vue: 'Vue',
                    vuetify: 'Vuetify',
                },
                manualChunks: (id) => {
                    if(id.includes("vuetify"))
                        return "vuetify"
                    return null
                },*/
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'index.css';
                    }
                    return '[name].[ext]';
                },
                chunkFileNames: "[name].js",
                entryFileNames: "[name].js",
            },
            plugins: [commonjs()],
        },
    },
    css: {
        devSourcemap: true,
    },
    test: {
        // enable jest-like global test APIs
        globals: true,
        // simulate DOM with happy-dom
        // (requires installing happy-dom as a peer dependency)
        environment: 'happy-dom'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json', '.vue', '.scss'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            // '@oxylus': resolve(__dirname, '.') // fileURLToPath(new URL('./ox/src/', import.meta.url)),
            //'@oxylus_locations': fileURLToPath(new URL('./@oxylus/locations/src/', import.meta.url)),
        }
    }
})
