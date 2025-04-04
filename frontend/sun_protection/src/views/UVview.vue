<template>
  <div class="uv-container">
    <div class="header">
      <h1>🌞 UV Index Checker</h1>
      <p>Enter any suburb name in Melbourne or Melbourne to check its current UV index</p>
    </div>

    <div class="search-box">
      <input type="text" v-model="city" placeholder="Enter suburb name (e.g. Clayton)" />
      <button @click="fetchUVIndex">🔍 Check</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-if="error" class="error">{{ error }}</div>
    <div class="image-container">
      <img :src="uvScaleImage" alt="uv scale" class="centered-image">
    </div>
    <div v-if="uvData" class="uv-card" :style="{ backgroundColor: getUVColor(uvData.uv) }">
      <h2>{{ uvData.city }}</h2>
      <p>Latitude: {{ uvData.latitude }}, Longitude: {{ uvData.longitude }}</p>
      <p class="uv-index">UV Index: <strong>{{ uvData.uv }}</strong></p>
      <p class="uv-message">{{ getUVMessage(uvData.uv) }}</p>
    </div>
    <div v-if="uvData" class="recommend-box">
      <p> </p>
      <button @click="goToRecommendation">Get Your Recommendation</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import uvScaleImage from '@/assets/uv_scale.webp';
import { useRouter } from 'vue-router';
const router = useRouter();
const city = ref('');
const uvData = ref(null);
const loading = ref(false);
const error = ref(null);
const goToRecommendation = () => {
  router.push('/recommend');
};
const fetchUVIndex = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`https://onboardingprojectsunprotectio-production.up.railway.app/api/uv-index?city=${encodeURIComponent(city.value.toUpperCase())}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    uvData.value = data;
  } catch (err) {
    error.value = err.message || 'Failed to fetch UV index!';
  } finally {
    loading.value = false;
  }
};

const getUVColor = (uv) => {
  if (uv < 3) return '#4CAF50';
  if (uv < 6) return '#FFEB3B';
  if (uv < 8) return '#FF9800';
  if (uv < 11) return '#F44336';
  return '#9C27B0';
};

const getUVMessage = (uv) => {
  if (uv == 0) return '🌿 No risk. Enjoy your day!';
  if (uv < 3) return '🌿 Low risk. Enjoy the sun!';
  if (uv < 6) return '🧴 Moderate risk. Wear sunscreen!';
  if (uv < 8) return '🕶 High risk. Seek shade!';
  if (uv < 11) return '🔥 Very high risk. Avoid direct sun!';
  return '🚨 Extreme risk! Stay indoors if possible!';
};
</script>

<style scoped>
.uv-container {
  text-align: center;
  padding: 40px 20px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(to bottom, #87CEFA, #f0f8ff);
  min-height: 100vh;
}

.header h1 {
  font-size: 28px;
  color: #333;
}
.header p {
  color: #555;
}

.search-box {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}
input {
  padding: 12px;
  font-size: 16px;
  width: 250px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  background: #ffcc00;
  padding: 12px 18px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: #ff9900;
}

.uv-card {
  padding: 20px;
  margin-top: 20px;
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: 0.3s ease-in-out;
  animation: fadeIn 0.5s ease-in-out;
}
.uv-card h2 {
  font-size: 24px;
}
.uv-index {
  font-size: 22px;
  font-weight: bold;
}
.uv-message {
  font-size: 18px;
  margin-top: 10px;
}

.loading {
  font-size: 18px;
  color: #007bff;
}
.error {
  color: red;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


