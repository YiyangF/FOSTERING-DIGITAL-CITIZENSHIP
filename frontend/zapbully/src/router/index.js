import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Homeview.vue'
import Simulator from '../views/Simulator.vue'
import InfographicPage from '../views/InfographicPage.vue'
import Story from '@/views/Story.vue'
import Symptom from '@/views/Symptom.vue'
import Faq from '@/views/Faq.vue'
import support from '@/views/Support.vue'

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
  },
  {
    path: '/story/:storyId',
    name: 'Story',
    component: Story
  },
  {
    path: '/symptom',
    name: 'Symptom',
    component: Symptom
  },
  {
    path: '/faq',
    name: 'Faq',
    component: Faq
  },
  {
    path: '/support',
    name: 'Support',
    component: support
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


