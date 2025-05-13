import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Homeview.vue'
import Simulator from '../views/Simulator.vue'
import InfographicPage from '../views/InfographicPage.vue'
import Symptom from '@/views/Symptom.vue'
import Faq from '@/views/Faq.vue'
import Support from '@/views/Support.vue'
import PasswordGate from '@/views/PasswordGate.vue'
import toast from '../utils/toast'
import Story from '@/views/Story.vue'
import Emoji from '@/views/Emoji.vue'

const routes = [
  {
    path: '/gate',
    name: 'PasswordGate',
    component: PasswordGate
  },
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
    path: '/story/:storyId',
    name: 'Story',
    component: Story
  },
  {
    path: '/data-insights',
    name: 'InfographicPage',
    component: InfographicPage
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
    component: Support
  },
  {
    path: '/emoji',
    name: 'Emoji',
    component: Emoji
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true'

  if (!isAuthenticated && to.name !== 'PasswordGate') {
    toast.info('Please enter the access password to continue.')
    return next({ name: 'PasswordGate' })
  }

  next()
})


export default router
