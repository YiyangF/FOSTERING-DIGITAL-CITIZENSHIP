<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showToolkitMenu = ref(false)
const showSupportMenu = ref(false)
const mobileMenu = ref(false)

const toolkitItems = [
  {
    title: 'Symptom Checker',
    desc: 'Identify common signs of cyber distress.',
    icon: '/assets/card/sym.png',
    link: '/symptom'
  },
  {
    title: 'Message Checker',
    desc: 'Detect toxic or bullying language in messages.',
    icon: '/assets/card/msg.png',
    link: '/message'
  },
  {
    title: 'Emoji Dictionary',
    desc: 'Learn to communicate more positively online.',
    icon: '/assets/card/emj.png',
    link: '/emoji'
  }
]

const supportItems = [
  {
    title: 'Guide',
    desc: 'Step-by-step parental guidance for online safety.',
    icon: '/assets/card/gui.png',
    link: '/support'
  },
  {
    title: 'FAQ',
    desc: "Find quick answers to parents' common questions.",
    icon: '/assets/card/faq.png',
    link: '/faq'
  }
]

function handleClickOutside(event: MouseEvent) {
  const toolkit = document.querySelector('.toolkit-wrapper')
  const support = document.querySelector('.support-wrapper')
  const nav = document.querySelector('.nav-wrapper')

  if (toolkit && !toolkit.contains(event.target as Node)) {
    showToolkitMenu.value = false
  }
  if (support && !support.contains(event.target as Node)) {
    showSupportMenu.value = false
  }
  if (nav && !nav.contains(event.target as Node)) {
    mobileMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="nav-wrapper">
    <div class="logo-box">
      <router-link to="/" exact-active-class="active-link">
        <img src="@/assets/logo.png" alt="zapbully-Logo" class="logo-img" />
      </router-link>
    </div>
    <button class="mobileMenu-button" @click="mobileMenu = !mobileMenu">
      ☰
    </button>
    <nav :class="['custom-nav', { 'mobileMenu': !mobileMenu }]">
      <router-link to="/" @click="mobileMenu = false" class="nav-item-link">Home</router-link>
      <router-link to="/data-insights" @click="mobileMenu = false" class="nav-item-link">Data Insights</router-link>
      <router-link to="/safety-simulations" @click="mobileMenu = false" class="nav-item-link">Simulations</router-link>

      <div class="mega-wrapper toolkit-wrapper">
        <router-link to="#" class="nav-item-link" @click.prevent="showToolkitMenu = !showToolkitMenu">
          Toolkit ▼
        </router-link>
        <div v-if="showToolkitMenu" class="mega-panel" @click.stop>
          <div class="container">
            <router-link
              v-for="item in toolkitItems"
              :key="item.title"
              :to="item.link"
              class="mega-card"
              @click="showToolkitMenu = false"
            >
              <img :src="item.icon" :alt="item.title" class="mega-icon" />
              <div class="mega-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div class="mega-wrapper support-wrapper">
        <router-link to="#" class="nav-item-link" @click.prevent="showSupportMenu = !showSupportMenu">
          Support ▼
        </router-link>
        <div v-if="showSupportMenu" class="mega-panel" @click.stop>
          <div class="container2">
            <router-link
              v-for="item in supportItems"
              :key="item.title"
              :to="item.link"
              class="mega-card"
              @click="showSupportMenu = false"
            >
              <img :src="item.icon" :alt="item.title" class="mega-icon" />
              <div class="mega-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<!-- styles are assumed correct and will be kept in your <style scoped> section as is -->

<style scoped>
.nav-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 16px 40px;
  background: #fff;
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  z-index: 1000;
}

.logo-box {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.custom-nav {
  display: flex;
  gap: 32px;
  font-size: 16px;
  font-weight: 600;
  align-items: center;
}

.nav-item-link {
  position: relative;
  color: #222;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.2s ease-in-out;
}

.nav-item-link::after {
  content: '';
  position: absolute;
  width: 0%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #f9a825;
  transition: width 0.3s ease-in-out;
}

.nav-item-link:hover{
  background-color: #fff7d6;
  border-radius: 6px;
  color: #d48a00;

}
.nav-item-link:hover::after,
.active-link::after {
  color: #f9a825;
  width: 100%;
}

/* ========mega menu general style=========== */.mega-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100vw;
  background-color: #fff;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
  padding: 2rem 0;
  z-index: 999;
  border-bottom: 1px solid #eee;
  animation: floatDown 0.3s ease-out;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 0 2rem;
}
.container2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  padding: 0 3rem;

  max-width: 800px;     
  margin: 0 auto;     
}

.mega-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  padding: 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: #fff;
  border: 1px solid transparent;
  cursor: pointer;
}

.mega-card:hover {
  transform: translateY(-6px);
  border-color: #f9a825;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.mega-icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.mega-content h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0 0.25rem;
  color: #222;
}

.mega-content p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
  max-width: 240px;
}

@keyframes floatDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Mobile Responsive ========== */
.mobileMenu-button {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
}

@media (max-width: 768px) {
  .mobileMenu-button {
    display: block;
    margin-left: auto;
  }

  .custom-nav {
    display: none;
    flex-direction: column;
    width: 100%;
    background-color: #fff8e1;
    margin-top: 1rem;
    border-top: 1px solid #ddd;
    padding: 0.5rem 0;
    border-radius: 8px;
  }

  .custom-nav.mobileMenu {
    display: flex;
  }

  .nav-item-link {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
    color: #222;
  }

  .nav-item-link:hover {
    background-color: #fff2cc;
    border-radius: 6px;
  }

  .dropdown-menu {
    position: static;
    background-color: #fff7dc;
    padding-left: 1.5rem;
    box-shadow: none;
    border-radius: 0;
  }

  .dropdown-menu .nav-item-link {
    padding: 0.75rem 2rem;
  }

  .dropdown-menu .nav-item-link:hover {
    background-color: #fff1b8;
  }
}

</style>
