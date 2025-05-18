<template>
  <div class="message-detector">
    <div class="container">
        <h1 class="title">Message Detector</h1>
        <h2 class="subtitle">Understanding Verbal Bullying</h2>
        
        <p class="description">
            Words can hurt. Did your kids receive any harassment, negative or suspicious messages? Or have
            your kids sent these kinds of messages unconsciously? This detector can explain how certain
            words or phrases impact others, and offer suggestions to make the message kinder.
        </p>
        
        <div class="message-input">
            <div class="input-label">Enter or paste the message below to detect</div>
            <textarea v-model="message" class="text-input" placeholder="Type a message to analyze..." rows="10"></textarea>
            <p class="input-requirements" :class="{ 'error': message.length > 0 && !isValidInput }">
                Message should be between 10 and 200 characters.
                Current: {{ message.length }}/200
            </p>
        </div>
      
        <div class="button-container">
            <button :disabled="!isValidInput || isLoading" @click="detectMessage" class="detect-button">{{ isLoading ? 'Analyzing...' : 'Start Detecting' }}</button>
            <button @click="clearMessage" class="clear-button">Clear</button>
        </div>
      
        <div v-if="analyzedResult" class="analyzed-message">
            <h3>Analysis Result:</h3>
            <div class="result-content">
                <p class="result-type" :class="{ 'is-cyberbullying': isCyberbullying }">
                    {{ isCyberbullying ? 'Detected: Potential Cyberbullying' : 'Message appears safe' }}
                </p>
                <p class="result-percentage">Confidence: {{ (analyzedResult.confidence * 100).toFixed(2) }}%</p>
                <div class="chart-wrapper" v-if="getChartData">
                    <Pie :data="getChartData" :options="chartOptions" />
                </div>
            </div>
        </div>

        <div v-if="analyzedResult" class="result-actions">
            <router-link to="/support" class="support-button">Get Support</router-link>
            <router-link to="/symptom" class="symptom-button">Learn the Symptoms</router-link>
        </div>
      
        <div v-if="error" class="error-message">
            <p>{{ error }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: 'MessageDetector',
  components: {
    Pie,
  },
  setup() {
    const message = ref('');
    const analyzedResult = ref(null);
    const isLoading = ref(false);
    const error = ref('');

    const isValidInput = computed(() => {
      return message.value.length >= 10 && message.value.length <= 200;
    });

    const isCyberbullying = computed(() => {
      if (!analyzedResult.value) return false;
      return analyzedResult.value.prediction === 'cyberbullying';
    });

    const detectMessage = async () => {
      if (!isValidInput.value) return;

      isLoading.value = true;
      error.value = '';

      try {
        const apiUrl = 'https://backend-python-production-9d2c.up.railway.app/predict';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: message.value }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        analyzedResult.value = data;
      } catch (err) {
        error.value = 'Failed to analyze message. Please try again later.';
        console.error('API Error:', err);
      } finally {
        isLoading.value = false;
      }
    };

    const clearMessage = () => {
      message.value = '';
      analyzedResult.value = null;
      error.value = '';
    };

    const getChartData = computed(() => {
      if (!analyzedResult.value) return null;

      const confidence = analyzedResult.value.confidence * 100;

      return {
        labels: ['Confidence', 'Remaining'],
        datasets: [
          {
            data: [confidence, 100 - confidence],
            backgroundColor: [isCyberbullying.value ? '#d83933' : '#2e8540', '#ffffff'],
            borderColor: [isCyberbullying.value ? '#d83933' : '#2e8540', '#e0e0e0'],
            borderWidth: 1,
          },
        ],
      };
    });

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw.toFixed(1)}%`;
            },
          },
        },
      },
    };

    return {
      message,
      analyzedResult,
      isLoading,
      error,
      isValidInput,
      isCyberbullying,
      detectMessage,
      clearMessage,
      getChartData,
      chartOptions,
    };
  },
};
</script>


<style scoped>
.message-detector {
  min-height: 100vh;
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #005475;
  font-family: 'Arial', sans-serif;
}

.container {
  max-width: 800px;
  width: 100%;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #005475;
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #005475;
}

.description {
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.1rem;
}

.message-input {
  margin-bottom: 1.5rem;
}

.input-label {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-align: left;
  font-weight: bold;
}

.input-requirements {
  text-align: right;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.input-requirements.error {
  color: #d83933;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: none;
  transition: border-color 0.3s;
}

.text-input:focus {
  outline: none;
  border-color: #6188F5;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.detect-button {
  background-color: #6188F5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  min-width: 150px;
}

.detect-button:hover:not(:disabled) {
  background-color: #4d6fd8;
  transform: translateY(-2px);
}

.detect-button:active:not(:disabled) {
  transform: translateY(0);
}

.detect-button:disabled {
  background-color: #a8b8e8;
  cursor: not-allowed;
}

.clear-button {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  margin-left: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 100px;
}

.clear-button:hover {
  background-color: #c6c6c6;
}

.analyzed-message {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  text-align: left;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.analyzed-message h3 {
  color: #005475;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.result-content {
  margin-top: 1rem;
}

.result-type {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2e8540;
  padding: 0.5rem;
  border-radius: 6px;
  background-color: rgba(46, 133, 64, 0.1);
  display: inline-block;
}

.result-type.is-cyberbullying {
  color: #d83933;
  background-color: rgba(216, 57, 51, 0.1);
}

.result-percentage {
  font-size: 1.1rem;
  margin: 1rem 0;
}

.chart-wrapper {
  max-width: 200px;
  margin: 1rem auto;
}

.explanation {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  border-left: 4px solid #6188F5;
}

.explanation h4 {
  color: #005475;
  margin-bottom: 0.5rem;
}

.result-actions {
  margin-top: 20px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.support-button,
.symptom-button {
  background-color: #6188f5;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(97, 136, 245, 0.2);
}

.support-button:hover,
.symptom-button:hover {
  background-color: #4a6bd4;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(97, 136, 245, 0.3);
}

.error-message {
  background-color: rgba(216, 57, 51, 0.1);
  color: #d83933;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: left;
  border-left: 4px solid #d83933;
}

@media (max-width: 768px) {
  .message-detector {
    padding: 1rem;
  }
  
  .container {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.5rem;
  }
  
  .button-container {
    flex-direction: column;
    align-items: center;
  }
  
  .clear-button {
    margin-left: 0;
    margin-top: 1rem;
  }
  
  .result-actions {
    flex-direction: column;
  }
}
</style>