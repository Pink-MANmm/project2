import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'

import '@/index.css'

const app = createApp(App)

axios.defaults.baseURL = "http://127.0.0.1:8000/"
app.config.globalProperties.$http = axios

app.use(router).mount('#app')
