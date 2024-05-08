// main.ts
import { createApp } from 'vue'
import './assets/main.css';
import App from './App.vue'
import { pinia } from './stores'
import router from './router'
import ElementPlus from 'element-plus' // 引入 Element Plus
import 'element-plus/dist/index.css' // 引入 Element Plus 样式文件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useAuthStore } from './stores/authStore'

// 创建一个应用实例
const app = createApp(App)

// 使用 router、pinia 和 Element Plus
app.use(router) // 注册 Vue Router
app.use(pinia) // 注册 Pinia 状态管理
app.use(ElementPlus) // 全局注册 Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 初始化存储的用户认证状态
const authStore = useAuthStore();
authStore.initializeAuth();

// 将应用实例挂载到 DOM 元素 '#app' 上
app.mount('#app')
