import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    //const env = loadEnv(mode, process.cwd(), '')
    loadEnv(mode, '.env')
    return {
        plugins: [vue()],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "src/assets/app.scss";`
                }
            }
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        }
    }
})