import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from "vite-tsconfig-paths";

const PLUGINS = () => [tsconfigPaths(), svelte()]

// https://vitejs.dev/config/
export default defineConfig({
  base: "/pulse-calculator/",
  plugins: PLUGINS(),
  worker: {
    format: 'es',
    plugins: PLUGINS(),
    rollupOptions: {
      output: {
        assetFileNames: 'assets/worker_asset-[name].[ext]',
        chunkFileNames: 'assets/worker_chunk-[name].js',
        entryFileNames: 'assets/worker_entry-[name].js',
      },
    },
  }
})
