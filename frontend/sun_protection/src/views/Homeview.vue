<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero" :style="{ backgroundImage: `url(${sunProtectionImage})` }">
      <div class="overlay">
        <h1>Stay Safe Under the Sun with SPF365+</h1>
        <p>Sun exposure is essential, but too much can put your health at risk. Our platform empowers you with real-time UV monitoring, historical melanoma insights, and personalized protection recommendations — helping you make informed decisions about sun safety every day.</p>
      </div>
    </section>

    <div class="container px-4 py-5" id="hanging-icons">
      <h2 class="pb-2 border-bottom">What We Offer</h2>
      <div class="row g-4 py-5 row-cols-1 row-cols-lg-3 align-items-stretch text-center">
        <div class="col d-flex flex-column justify-content-center align-items-center">
          <h3 class="fs-2 text-body-emphasis">🌞 Live UV Index Tracking</h3>
          <p>With our UV Index Checker, you can quickly look up the current UV radiation levels based on location, helping you plan outdoor activities while minimizing UV risks.</p>
          <a @click="goToUVIndex" class="btn btn-primary">
            Try the UV checker
          </a>
        </div>
        <div class="col d-flex flex-column justify-content-center align-items-center">
          <h3 class="fs-2 text-body-emphasis">📊 Understanding UV Impact</h3>
          <p>Our data visualization tool presents a clear relationship between UV exposure, historical skin cancer incidence, and mortality rates across different regions over time.</p>
          <a @click="goToDataVisualization" class="btn btn-primary">
            View the data
          </a>
        </div>
        <div class="col d-flex flex-column justify-content-center align-items-center">
          <h3 class="fs-2 text-body-emphasis">🛡️ Personalized Sun Protection</h3>
          <p>Get tailored sun protection recommendations and notifications based on your skin type and UV intensity, helping you develop good habits and reduce skin damage risks.</p>
          <a @click="goToRecommendation" class="btn btn-primary">
            Get your recommendations
          </a>
        </div>
      </div>
    </div>


    <!-- Info Section -->
    <div class="container_info">
      <section class="info">
        <div class="info-content">
          <h2>Why Sun Protection is Essential?</h2>
          <p>
            Every year, thousands of Australians are diagnosed with <span class="highlight">skin cancer</span>. 
            Understanding the risks of excessive UV exposure can help you make better decisions for your health.
          </p>
          <p>
            Protecting your skin today means a healthier future. Start by staying informed!
          </p>
        </div>
      </section>

      <section class="webinfo">
        <div class="info-content">
          <h2>About this website</h2>
          <p>
            SPF365+ is an innovative platform designed to help users understand skin cancer risks, UV index levels, and personalized sun protection strategies. Our goal is to provide easy access to essential UV protection information, enabling users to take proactive steps in safeguarding their skin.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import sunProtectionImage from '@/assets/homepage.jpg';
import { ref } from "vue";
import { useRouter } from "vue-router"; 

const router = useRouter();

const goToDataVisualization = () => {
  router.push('/about');
};

const goToUVIndex = () => {
  router.push('/uv');
};

const goToRecommendation = () => {
  router.push('/recommend');
};
</script>

<style scoped>
.container_info {
  display: flex;
  align-items: center;
  margin: 0 auto; /* Centers the container */
  padding: 0 5%;
}

.home {
  width: 100%;
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.hero {
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}


.overlay {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  color: white;
}

.hero h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.hero p {
  font-size: 18px;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 12px 20px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn-data {
  background: #007bff;
  color: white;
}

.btn-uv {
  background: #ff5733;
  color: white;
}

button:hover {
  transform: scale(1.05);
}

.btn-data:hover {
  background: #0056b3;
}

.btn-uv:hover {
  background: #d43f00;
}

/* Info Section */
.info, .webinfo {
  flex: 1;
  background: white;
  text-align: center;
  padding: 40px 5%;
}

.info-content {
  width: 100%;
}

.info h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #ff9900;
}

.info p {
  font-size: 18px;
  margin-bottom: 10px;
  color: #444;
}

.webinfo h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color:#ffcc00;
}

.webinfo p {
  font-size: 18px;
  margin-bottom: 10px;
  color: #444;
}

.highlight {
  color: #007bff;
  font-weight: bold;
}
</style>
