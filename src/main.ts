import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import DialogDirective from './directives/v-dialog'

// 引入 PSV 样式
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
// app.directive('dialog', DialogDirective)
app.use(pinia)
app.use(router)
app.mount('#app')
