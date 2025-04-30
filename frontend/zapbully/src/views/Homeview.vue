<template>
  <!-- Hero Section -->
  <div class="hero-container">
    <!-- 粒子背景层 -->
    <div class="particle-background" aria-hidden="true">
      <span
        v-for="(p, index) in particles"
        :key="index"
        class="particle"
        :style="{ '--x': `${p.x}px`, '--y': `${p.y}px` }"
      ></span>
    </div>

    <!-- 背景图标容器 -->
    <div class="floating-icons" aria-hidden="true">
      <img
        v-for="(icon, index) in icons"
        :key="index"
        :src="getIcon(icon.type)"
        :style="{ top: icon.top, left: icon.left }"
        class="icon-float glow"
      />
    </div>

    <!-- 主标题文字 -->
    <div class="hero-text">
      <h1>
        Shield Your Child from
        <!-- 首页贴图 -->
        <!-- <span class="highlight zap sticker-wrap" @mouseup="handleSelect">
          Cyberbullying
          <img v-if="showSticker" :src="iconMap['sticker']" alt="sticker" class="sticker-icon animated-sticker" />
        </span> -->
        <span class="highlight zap">
          Cyberbullying
        </span>

      </h1>
      <p>Empowered Parents. Safer Screens. Stronger Futures.</p>
    </div>

    <!-- 向下箭头 -->
    <div class="arrow-container">
      <button class="down-arrow" @click="scrollToFeatures" aria-label="Scroll down">↓</button>
    </div>
  </div>

  <!-- 第二屏幕：功能卡片 -->
  <section ref="featureSection" class="feature-section">
    <div class="card-grid">
      <div
        class="feature-card"
        v-for="(card, index) in featureCards"
        :key="index"
        :class="{ 'animate-in': hasIntersected }"
        :style="{ animationDelay: `${0.2 * (index + 1)}s` }"
      >
        <div class="card-cover">
          <img :src="card.image" :alt="card.title" class="card-image" />
          <div class="card-title">{{ card.title }}</div>
        </div>
        <div class="card-details">
          <p>{{ card.description }}</p>
          <button class="card-button">{{ card.buttonText }}</button>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import mailIcon from '@/assets/icons/mail.svg'
import bubbleIcon from '@/assets/icons/bubble.svg'
import macIcon from '@/assets/icons/mac.svg'
import hfaceIcon from '@/assets/icons/hface.svg'
import sfaceIcon from '@/assets/icons/sface.svg'
// import stickerIcon from '@/assets/icons/sticker.jpg'
import faqImage from '@/assets/card/FAQ.png'
import guiImage from '@/assets/card/gui.png'
import simImage from '@/assets/card/sim.png'
import symImage from '@/assets/card/sym.png'
const iconMap = {
  mail: mailIcon,
  bubble: bubbleIcon,
  mac: macIcon,
  hface: hfaceIcon,
  sface: sfaceIcon,
  // sticker: stickerIcon
}

// const showSticker = ref(false)
const featureSection = ref(null)
const hasIntersected = ref(false)

function scrollToFeatures() {
  featureSection.value?.scrollIntoView({ behavior: 'smooth' })
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

// function handleSelect() {
//   const selection = window.getSelection()
//   if (selection && selection.toString().toLowerCase().includes('cyberbullying')) {
//     showSticker.value = true
//     setTimeout(() => {
//       showSticker.value = false
//     }, 2000)
//   }
// }

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

function getIcon(type) {
  return iconMap[type] || ''
}

const featureCards = [
  {
    title: 'Try Simulator',
    description: 'Experience a simulated cyberbullying scenario.',
    buttonText: 'Try Now',
    image: simImage
  },
  {
    title: 'Parental Guide',
    description: 'Learn how to protect your child online.',
    buttonText: 'Learn More',
    image: guiImage
  },
  {
    title: 'Symptom Checker',
    description: 'See what others have experienced.',
    buttonText: 'Explore',
    image: symImage
  },
  {
    title: 'FAQ',
    description: 'Find answers to your most common questions.',
    buttonText: 'Read More',
    image: faqImage
  }
]
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

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* 粒子流动效果 */
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

.particle:nth-child(n) {
  --i: calc(var(--n) / 40);
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
  z-index: 1;
  max-width: 700px;
}

.hero-text h1 {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1.1;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
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

.sticker-wrap {
  position: relative;
  display: inline-block;
}

.sticker-icon {
  position: absolute;
  top: -40px;
  right: -25px;
  width: 64px;
  transform: rotateX(90deg);
  opacity: 0;
}

.animated-sticker {
  animation: flipIn 0.6s forwards ease-out;
}

@keyframes flipIn {
  0% {
    transform: rotateX(90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

.hero-text p {
  font-size: 1.75rem; /* 更大 */
  color: #dbeafe; /* 浅蓝色，和背景区分开 */
  margin-top: 1.5rem;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5); /* 同样添加轻微阴影 */
}

.hero-text .down-arrow {
  margin-top: 2rem;
  font-size: 2rem;
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  animation: bounceDown 2s infinite;
}

.hero-text .down-arrow:hover {
  color: #60a5fa;
}

/* 向下箭头 */
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
/* 导航卡片 */

.floating-faq-card {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 2;
  animation: floatUpDown 4s ease-in-out infinite;
  color: #f8fafc;
}

.floating-faq-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.floating-faq-card p {
  font-size: 1rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
}

.faq-button {
  padding: 8px 16px;
  font-size: 1rem;
  color: #ffffff;
  background-color: #3b82f6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.faq-button:hover {
  background-color: #2563eb;
}

/* FAQ 卡片浮动动画 */
@keyframes floatUpDown {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}

/* 第二页 */
.feature-section {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #3b74c7, #1e2f5d);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  padding: 3rem;
  max-width: 1200px;
  width: 100%;
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

