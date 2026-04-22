import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
// import 'primevue/resources/themes/lara-light-blue/theme.css'
// import 'primevue/resources/primevue.min.css'
// import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura';


import './style.css' // tailwind

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false
        }
    }
})
// app.use(ToastService)  
import router from './router'

app.use(router)

app.mount('#app')