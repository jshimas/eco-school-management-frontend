import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.css'

import App from './App.vue'
import VueCookies from 'vue-cookies'
import router from './router'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(VueCookies, { expires: '90d' })
app.use(createPinia())
app.use(router)

app.mount('#app')
import 'bootstrap/dist/js/bootstrap.js'
