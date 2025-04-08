<template>
  <div class="container">
    <header>
      <Navigation />
    </header>

    <!-- Title and Blue Box in Same Row -->
    <div class="header-section">
      <div class="title-box">
        Protect the child's online<br />
        world,starting here!
      </div>
      <div class="left-box">
        <p class="test-text"> 🧐 How much do I know about my child's online safety?</p>
        <button class="test-button" @click="showTest = true">start test > </button>
      </div>
    </div>

    <!-- Right Box Below Title/Blue Box -->
    <div class="right-box bg-image">
      <div class="svg-wrapper">
        <svg class="banner-svg" width="200" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- <path d="M10 50 L30 30 L50 50 L70 30 L90 50" stroke="#f2b705" stroke-width="4"/>
          <circle cx="30" cy="30" r="3" fill="#f2b705"/>
          <circle cx="50" cy="50" r="3" fill="#f2b705"/>
          <circle cx="70" cy="30" r="3" fill="#f2b705"/> -->
        </svg>
      </div>

      <p class="info-text">
        Your love is your child's greatest protection in the digital world.<br />
        "Learn, explore, and empower yourself to guide them safely through the online world."
      </p>

      <!-- Test Component: show when button clicked -->
      <transition name="fade-slide">
        <div class="test-box" v-if="showTest">
          <test />
          <button class="test-button" @click="toggleTest">close</button>
        </div>
      </transition>
    </div>
    <main class="main-box">
  <router-view></router-view>
<!-- NEWS -->
  <!-- <section class="news-section">
    <h2 class="news-title">Latest News</h2>
    <div class="news-list">
      <div class="news-item">
        <h3>📰 Parents' Guide to Online Safety Tools</h3>
        <p>Discover the top tools and practices to protect your child online in 2025.</p>
        <a href="#">Read more →</a>
      </div>
      <div class="news-item">
        <h3>🌐 Trends in Children's Internet Use</h3>
        <p>New studies show how children's screen time and online habits have shifted this year.</p>
        <a href="#">Read more →</a>
      </div>
    </div>
  </section> -->
  <section class="guide-section">
  <h2 class="guide-title">How Can We Help You?</h2>

  <div class="guide-grid">
    <!-- Insight Card -->
    <div class="guide-card-box">
      <img src="/data.gif" alt="Insight Feature" class="guide-image" />
      <div class="guide-content">
        <h3> Insight Feature</h3>
        <p>
          Learn how cyberbullying quietly affects teenagers' mental health. We provide real data and analysis to help you uncover the truth and protect your child's growth.
        </p>
        <router-link to="/insight" class="cta-button">Explore Insights →</router-link>
      </div>
    </div>

    <!-- Simulation Card -->
    <div class="guide-card-box">
      <img src="/chat.gif" alt="Simulation Feature" class="guide-image" />
      <div class="guide-content">
        <h3>Simulation Feature</h3>
        <p>
          Our interactive simulation brings you into your child's world. Understand what they may be going through and learn to communicate effectively, keeping them safe from emotional harm.
        </p>
        <router-link to="/simulation" class="cta-button">Try Simulation →</router-link>
      </div>
    </div>
  </div>
</section>
</main>

  </div>
</template>

<script setup>
import { ref } from 'vue';
// import Navigation from './components/Navigation.vue';
import test from './test.vue';

const showTest = ref(false);
const toggleTest = () => (showTest.value = !showTest.value)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap');

.container {
  min-height: 100vh;
  padding: 60px 20px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
}

.header-section {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

.title-box {
  padding: 20px;
  font-size: 50px;
  font-weight: bold;
  color: #111827;
  line-height: 1.4;
  font-family: 'Nunito', sans-serif;
  flex: 1;
  min-width: 300px;
}

.left-box {
  background-color: #b2d4eb;
  color: white;
  padding: 24px;
  border-radius: 30px;
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.test-text {
  font-size: 20px;
  font-weight: 550;
  margin-bottom: 16px;
}

.test-button {
  background-color: #ffa726;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;
}

.test-button:hover {
  background-color: #fb923c;
}

.right-box {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.right-box.bg-image {
  background-image: url('/whitebox.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.svg-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
}

.banner-svg {
  margin: 0 auto 20px;
  display: block;
}

.info-text {
  color: #1f2937;
  font-size: 25px;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 12px;
  text-shadow: 5px 5px 15px white;
}

.test-box {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
}

/* 动画过渡 */
.fade-slide-enter-active {
  animation: fadeInUp 0.6s ease;
}
.fade-slide-leave-active {
  animation: fadeOutDown 0.4s ease;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}
.news-section {
  margin-top: 40px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.news-title {
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: bold;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.news-item h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.news-item a {
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
}

.news-item a:hover {
  text-decoration: underline;
}

/* 功能导航 */
.guide-section {
  margin-top: 60px;
  padding: 30px 20px;
  background-color: #b2d4eb;
  border-radius: 16px;
}

.guide-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 32px;
  text-align: center;
  color: #1e3a8a;
}

.guide-grid {
  display: flex;
  flex-direction: column;
  gap: 200px;
}

@media (min-width: 768px) {
  .guide-grid {
    flex-direction: row;
    justify-content: space-between;
  }
}

.guide-card-box {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  overflow: hidden;
  flex: 1;
  max-width: 500px;
}

.guide-image {
  width: 10%;
  height: 40px;
  object-fit: cover;
}

.guide-content {
  padding: 20px;
}

.guide-content h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #111827;
}

.guide-content p {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 16px;
}

.cta-button {
  display: inline-block;
  background-color: #ffa726;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #fb923c;
}

</style>
