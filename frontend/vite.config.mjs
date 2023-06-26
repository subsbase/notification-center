import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.env')
  return {
    plugins: [vue()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "src/assets/app.scss";'
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      host: true,
      port: 3600
    }
  }
})
