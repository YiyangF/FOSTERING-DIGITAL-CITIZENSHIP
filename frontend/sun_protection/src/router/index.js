import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Homeview.vue'
import AboutView from '../views/Aboutview.vue'
import UVView from '../views/UVview.vue'
import RecommendView from '../views/test.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/uv',
    name: 'UV',
    component: UVView
  },
  {
    path: '/recommend',
    name: 'Recommendation',
    component: RecommendView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;


