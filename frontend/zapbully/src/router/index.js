import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Homeview.vue'
import Simulator from '../views/Simulator.vue'
import InfographicPage from '../views/InfographicPage.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/safety-simulations',
    name: 'Simulator',
    component: Simulator
  },
  {
    path: '/data-insights',
    name: 'InfographicPage',
    component: InfographicPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router;


