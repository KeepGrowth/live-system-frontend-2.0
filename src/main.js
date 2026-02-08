import { createPinia } from 'pinia'
import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(createPinia().use(piniaPluginPersistedstate))// ✅ 注册持久化Pinia插件
app.use(router)
app.mount('#app')
