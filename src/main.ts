import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import '@fortawesome/fontawesome-free/css/all.min.css'
// main.js
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/el-date-picker.css'
import '@/styles/el-select.css'

// 自定义指令
import preventReClick from '@/directives/preventReClick.js'

const app = createApp(App)
// 注册指令
app.directive('preventReClick', preventReClick)
app.use(ElementPlus)
app.use(router)
app.use(createPinia().use(piniaPluginPersistedstate))// ✅ 注册持久化Pinia插件



app.mount('#app')
