import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'mdb-vue-ui-kit/css/mdb.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Toast
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(router)

AOS.init({
  once: true, 
})

app.use(Toast, {
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: true,
})

app.mount('#app')
