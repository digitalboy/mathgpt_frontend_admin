// main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { pinia } from './stores'
import router from './router'
import ElementPlus from 'element-plus' // 引入 Element Plus
import 'element-plus/dist/index.css' // 引入 Element Plus 样式文件

// 创建一个应用实例
const app = createApp(App)

// 使用 router、pinia 和 Element Plus
app.use(router) // 注册 Vue Router
app.use(pinia) // 注册 Pinia 状态管理
app.use(ElementPlus) // 全局注册 Element Plus

// 将应用实例挂载到 DOM 元素 '#app' 上
app.mount('#app')
