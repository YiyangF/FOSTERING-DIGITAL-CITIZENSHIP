<template>
  <div class="hero-container">
    <div class="particle-background" aria-hidden="true">
      <span
        v-for="(p, index) in particles"
        :key="index"
        class="particle"
        :style="{ '--x': `${p.x}px`, '--y': `${p.y}px` }"
      ></span>
    </div>

    <div class="floating-icons" aria-hidden="true">
      <img
        v-for="(icon, index) in icons"
        :key="index"
        :src="getIcon(icon.type)"
        :style="{ top: icon.top, left: icon.left }"
        class="icon-float glow"
      />
    </div>

    <div class="hero-content">
      <div class="hero-text">
        <h1>
          Shield Your Child from
          <span class="highlight zap">Cyberbullying</span>
        </h1>
        <p class="subtitle">Empowered Parents. Safer Screens. Stronger Futures.</p>
        <div class="cta-group">
          <button class="primary-cta" @click="goToRoute('Simulator')">
            <span>Experience Safety Simulation</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="secondary-cta" @click="scrollToFeatures">
            Explore Features
          </button>
        </div>
      </div>
    </div>

    <div class="arrow-container">
      <button class="down-arrow" @click="scrollToFeatures" aria-label="Scroll down">↓</button>
    </div>
  </div>

  <section ref="featureSection" class="feature-section">
    <div class="card-grid">
      <div
        class="feature-card"
        v-for="(card, index) in featureCards"
        :key="index"
        :class="{ 'animate-in': hasIntersected }"
        :style="{ animationDelay: `${0.2 * (index + 1)}s` }"
        @click.stop="handleCardClick(card)"
      >
        <div class="card-cover">
          <img :src="card.image" :alt="card.title" class="card-image" />
          <div class="card-title">{{ card.title }}</div>
        </div>
        <div class="card-details">
          <p>{{ card.description }}</p>
          <button 
            type="button" 
            class="card-button"
            @click.stop="goToRoute(card.routeName)"
          >
            {{ card.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import mailIcon from '@/assets/icons/mail.svg'
import bubbleIcon from '@/assets/icons/bubble.svg'
import macIcon from '@/assets/icons/mac.svg'
import hfaceIcon from '@/assets/icons/hface.svg'
import sfaceIcon from '@/assets/icons/sface.svg'
import faqImage from '@/assets/card/faq.png'
import guiImage from '@/assets/card/gui.png'
import dataImage from '@/assets/card/data.png'
import symImage from '@/assets/card/sym.png'

const router = useRouter()
const iconMap = {
  mail: mailIcon,
  bubble: bubbleIcon,
  mac: macIcon,
  hface: hfaceIcon,
  sface: sfaceIcon
}

const featureSection = ref(null)
const hasIntersected = ref(false)

function scrollToFeatures() {
  const top = featureSection.value?.offsetTop
  const header = document.querySelector('header')
  const headerHeight = header?.offsetHeight || 80
  if (top !== undefined) {
    window.scrollTo({
      top: top - headerHeight,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        hasIntersected.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (featureSection.value) {
    observer.observe(featureSection.value)
  }
})

const particles = Array.from({ length: 100 }, () => ({
  x: (Math.random() * 2 - 1) * 200,
  y: (Math.random() * 2 - 1) * 200
}))

const icons = [
  { type: 'mail', top: '10%', left: '10%' },
  { type: 'bubble', top: '10%', left: '70%' },
  { type: 'mac', top: '30%', left: '20%' },
  { type: 'hface', top: '30%', left: '80%' },
  { type: 'sface', top: '50%', left: '10%' },
  { type: 'mail', top: '50%', left: '80%' },
  { type: 'bubble', top: '70%', left: '20%' },
  { type: 'mac', top: '70%', left: '70%' },
  { type: 'hface', top: '85%', left: '40%' },
  { type: 'sface', top: '85%', left: '60%' }
]

const featureCards = [
  {
    title: 'Data Visualisation ',
    description: 'Understanding the Risk of Cyberbullying in Australian Youth.',
    buttonText: 'Explore',
    image: dataImage
  },
  {
    title: 'Parental Guide',
    description: 'Learn how to protect your child online.',
    buttonText: 'Learn More',
    image: guiImage,
    routeName: 'Support'
  },
  {
    title: 'Symptom Checker',
    description: 'See what others have experienced.',
    buttonText: 'Explore',
    image: symImage,
    routeName: 'Symptom'
  },
  {
    title: 'FAQ',
    description: 'Find answers to your most common questions.',
    buttonText: 'Read More',
    image: faqImage,
    routeName: 'Faq'
  }
]

function getIcon(type) {
  return iconMap[type] || ''
}

function handleCardClick(card) {
  if (event.target.closest('.card-button')) {
    return
  }
  goToRoute(card.routeName)
}

function goToRoute(routeName) {
  router.push({ name: routeName })
}
</script>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #a6c6dd, #3b74c7);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  z-index: 2;
  width: 100%;
  padding: 0 2rem;
}

.particle-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  animation: particleMove 8s linear infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  --x: 0px;
  --y: -100px;
}

@keyframes particleMove {
  0% {
    transform: translate(-50%, -50%) translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y));
    opacity: 0;
  }
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.icon-float {
  position: absolute;
  width: 100px;
  height: 100px;
  opacity: 0.35;
  animation: float 20s ease-in-out infinite;
  filter: grayscale(0%) brightness(1.3);
}

.glow {
  filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.7)) drop-shadow(0 0 20px rgba(0, 217, 255, 0.4));
}

@keyframes float {
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-40px) translateX(10px); }
  50% { transform: translateY(0px) translateX(0px); }
  75% { transform: translateY(40px) translateX(-10px); }
  100% { transform: translateY(0px) translateX(0px); }
}

.hero-text {
  max-width: 800px;
  margin: 0 auto;
}

.hero-text h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .hero-text h1 {
    font-size: 5rem;
  }
}

.hero-text .highlight {
  color: #3b82f6;
}

.hero-text .zap {
  display: inline-block;
  transition: all 0.2s ease;
}

.hero-text .zap:hover {
  animation: zapEffect 0.8s ease;
  color: #ef4444;
  text-shadow: 0 0 8px #ff3c00, 0 0 20px #ff3c00;
}

@keyframes zapEffect {
  0% { transform: scale(1); }
  10% { transform: scale(1.05) rotate(-2deg); }
  20% { transform: scale(0.95) rotate(2deg); }
  30% { transform: scale(1.02) rotate(-1deg); }
  40% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(1); }
}

.subtitle {
  font-size: 1.75rem;
  color: #dbeafe;
  margin-bottom: 3rem;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
}

.cta-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  margin-top: 3rem;
}

@media (min-width: 640px) {
  .cta-group {
    flex-direction: row;
    justify-content: center;
  }
}

.primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.35);
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.primary-cta:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.45);
}

.primary-cta:active {
  transform: translateY(0);
}

.primary-cta svg {
  transition: transform 0.3s ease;
}

.primary-cta:hover svg {
  transform: translateX(4px);
}

.secondary-cta {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #dbeafe;
  background-color: transparent;
  border: 2px solid rgba(219, 234, 254, 0.5);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-cta:hover {
  background-color: rgba(219, 234, 254, 0.1);
  border-color: rgba(219, 234, 254, 0.8);
}

.arrow-container {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  justify-content: center;
}

.down-arrow {
  font-size: 5rem;
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  animation: bounceDown 2s infinite;
}

.down-arrow:hover {
  color: #bfd7f4;
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.feature-section {
  width: 100%;
  padding-top: 60px;
  padding-bottom: 80px;
  background: linear-gradient(to bottom, #3b74c7, #1e2f5d);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  position: relative;
  width: 100%;
  max-width: 320px;
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.3s ease;
  opacity: 0;
  transform: scale(0.95) translateY(20px);
  animation: scatterIn 0.6s ease forwards;
}

.feature-card.animate-in {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.card-cover {
  position: relative;
  height: 100%;
  transition: transform 0.4s ease;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-title {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-weight: bold;
  text-align: center;
}

.card-details {
  position: absolute;
  bottom: -100px;
  left: 0;
  width: 100%;
  padding: 16px;
  background-color: rgba(30, 41, 59, 0.9);
  color: #e2e8f0;
  text-align: center;
  transition: bottom 0.4s ease;
  opacity: 0;
}

.feature-card:hover .card-cover {
  transform: translateY(-60px);
}

.feature-card:hover .card-details {
  bottom: 0;
  opacity: 1;
}

.card-button {
  margin-top: 1rem;
  padding: 8px 16px;
  font-size: 0.95rem;
  color: #ffffff;
  background-color: #3b82f6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  pointer-events: auto;
}

.card-button:hover {
  background-color: #2563eb;
}

@keyframes scatterIn {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>