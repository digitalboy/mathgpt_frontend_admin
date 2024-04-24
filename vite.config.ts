import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  ],
  base: "https://math.beike.ai/admin/",
  resolve: {
    alias: {
      '@': '/src', // 设置 '@' 为 'src' 目录的别名
    },
  },
})
