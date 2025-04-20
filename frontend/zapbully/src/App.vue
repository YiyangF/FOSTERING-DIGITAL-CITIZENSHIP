<script setup>
import Navigation from './components/Navigation.vue';
// import test from './views/test.vue'
</script>

<template>
  <div class="main-container">
    <header>
      <Navigation/>
      <!-- <test/> -->
    </header>

    <main class="main-box">
      <router-view></router-view>
    </main>


    <footer class="footer">
      <div class="footer-container">
        <p>© {{ new Date().getFullYear() }} Help parents understand online risks access utilities and improve digital literacy</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* header {
  line-height: 1.5;
}

/* .main-container {
  background-image: url('/bbo.webp');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  backdrop-filter: blur(60px);
} */
@keyframes floatBlur {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -10px) scale(1.05);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

.main-container {
  position: relative;
  z-index: 1;
  overflow: hidden;
  min-height: 100vh;
  background-color: #fffaf0;
}

.main-container::before {
  content: '';
  position: absolute;
  top: -300px;
  left: -300px;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, #fdba74, #fef3c7);
  filter: blur(100px);
  opacity: 0.5;
  border-radius: 50%;
  z-index: -1;
}

.main-container::after {
  content: '';
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #fc8523, #fff7ed);
  filter: blur(60px);
  opacity: 0.4;
  border-radius: 50%;
  z-index: -1;
}


/* 动画效果
.main-container::before {
  content: '';
  position: absolute;
  top: -250px;
  left: -250px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, #fc8523, #e0f2fe);
  filter: blur(100px);
  opacity: 0.5;
  border-radius: 50%;
  z-index: -1;
  animation: floatBlur 12s ease-in-out infinite;
}

/* .main-container::after {
  content: '';
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #fc8523, #dbeafe);
  filter: blur(90px);
  opacity: 0.4;
  border-radius: 50%;
  z-index: -1;
  animation: floatBlur 1s ease-in-out infinite;
} */


.main-container::before::before {
  content: "";
  position: absolute;
  top: -300px;
  left: -300px;
  width: 1000px;
  height: 1000px;
  background-color: #fdec7f;
  border-radius: 50%;
  z-index: -1;
}


.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

.footer {
  background-color: #f8f9fa;
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: #555;
  margin-top: 30px;
}

.footer-container {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
}

.footer-links {
  margin-top: 10px;
}

.footer-links a {
  color: #007bff;
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  text-decoration: underline;
}

</style>


