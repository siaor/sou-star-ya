import {defineConfig} from 'vite'
import {resolve} from 'path'
import vue from '@vitejs/plugin-vue'

// 官网配置文档：https://vite.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 372
    },
    build: {
        target: "esnext",
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    plugins: [vue()],
})
