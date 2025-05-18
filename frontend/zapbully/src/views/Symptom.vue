<template>
  <div class="checker-page">
    <div class="container text-center">
      <h2 class="title">Emotional Distress Symptom Checker</h2>
      <p class="subtitle">Select <strong>3 to 6</strong> symptoms your child may be experiencing. The tool will assess severity and provide guidance.</p>

      <div class="card-scroll">
        <div
          v-for="(column, index) in visibleColumns"
          :key="index"
          class="symptom-card"
          :class="{ active: index === 1, blurred: index !== 1 }"
        >
          <div class="card-header">
            <img
              :src="categoryIcons[visibleHeaders[index]]"
              class="card-icon"
              :alt="visibleHeaders[index]"
            />
            <h5>{{ visibleHeaders[index] }}</h5>
          </div>

          <div class="card-body">
            <div v-for="(item, i) in column" :key="i" class="mb-2 symptom-option">
              <input
                type="checkbox"
                class="btn-check"
                :id="`cb-${index}-${i}`"
                :disabled="index !== 1 || (totalSelected >= 6 && !selections[startIndex][i])"
                v-model="selections[(startIndex - 1 + index + columns.length) % columns.length][i]"
                autocomplete="off"
              />
              <label
                class="symptom-btn"
                :for="`cb-${index}-${i}`"
              >
                {{ item }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-controls">
        <button @click="prev">&#8249;</button>
        <button @click="next">&#8250;</button>
      </div>

      <div class="submit-actions">
        <button class="clear-btn" @click="clearSelection">Clear</button>
        <button class="submit-btn" @click="submitSelection">Submit</button>
      </div>

      <div v-if="submissionError" class="error-msg">
        Please select between 3 and 6 symptoms before submitting.
      </div>

      <div v-if="resultVisible" class="result-card" ref="resultCard">
        <h4>Severity Analysis</h4>
        <div class="result-bar">
          <div class="result-fill" :style="{ width: finalScore * 20 + '%' }" :class="progressBarClass"></div>
          <div class="result-ticks">
            <span v-for="n in 5" :key="n" :style="{ left: (n * 20) + '%' }"></span>
          </div>
        </div>
        <p class="score-label">{{ finalScore.toFixed(1) }}/5 - <strong>{{ severityLabel }}</strong></p>
        <p class="result-summary">{{ recommendationText }}</p>
        <div class="result-actions">
          <button @click="clearSelection">Start Again</button>
          <button @click="goToSupport">Get Support</button>
        </div>
        <div class="disclaimer-note">
          <strong>Disclaimer:</strong> This tool provides preliminary guidance only. It is not a clinical diagnosis. If you are concerned about your child’s wellbeing, please consult a healthcare or mental health professional.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PsychologicalIcon from '@/assets/symptom-icons/Psychological.png';
import EmotionalIcon from '@/assets/symptom-icons/Emotional.png';
import BehaviouralIcon from '@/assets/symptom-icons/behavioural.png';
import PhysicalIcon from '@/assets/symptom-icons/Physical.png';
import SocialIcon from '@/assets/symptom-icons/Social.png';

export default {
  data() {
    return {
      columns: [
        ["Depressive symptoms", "Heightened anxiety", "Loneliness and isolation", "Low self-esteem", "Suicidal ideation"],
        ["Frequent anger or irritability", "Shame or embarrassment", "Emotional distress and sadness", "Mood swings", "Guilt or self-blame"],
        ["Avoidance of school or activities", "Declining academic performance", "Changes in device use", "Risky behaviors or substance use", "Loss of interest in personal care or hobbies"],
        ["Frequent headaches", "Stomach aches or nausea", "Sleep issues or nightmares", "Fatigue and low energy", "Changes in eating habits"],
        ["Social withdrawal", "Loss of friendships", "Avoidance of social settings", "Distrust of others", "Feeling ostracized"]
      ],
      headers: ["Psychological", "Emotional", "Behavioral", "Physical", "Social"],
      categoryIcons: {
        Psychological: PsychologicalIcon,
        Emotional: EmotionalIcon,
        Behavioral: BehaviouralIcon,
        Physical: PhysicalIcon,
        Social: SocialIcon
      },
      startIndex: 0,
      selections: Array.from({ length: 5 }, () => Array(5).fill(false)),
      fromResultPage: false,
      resultVisible: false,
      finalScore: 0,
      submissionError: false,
      scrollPosition: 0
    };
  },
  computed: {
    visibleColumns() {
      const len = this.columns.length;
      return [
        this.columns[(this.startIndex - 1 + len) % len],
        this.columns[this.startIndex],
        this.columns[(this.startIndex + 1) % len]
      ];
    },
    visibleHeaders() {
      const len = this.headers.length;
      return [
        this.headers[(this.startIndex - 1 + len) % len],
        this.headers[this.startIndex],
        this.headers[(this.startIndex + 1) % len]
      ];
    },
    totalSelected() {
      return this.selections.reduce((total, column) => total + column.filter(Boolean).length, 0);
    },
    selectedItems() {
      const selected = [];
      this.selections.forEach((column, colIndex) => {
        column.forEach((isSelected, itemIndex) => {
          if (isSelected) {
            selected.push({ text: this.columns[colIndex][itemIndex], column: colIndex, row: itemIndex });
          }
        });
      });
      return selected;
    },
    progressBarClass() {
      if (this.finalScore < 2) return 'level-1';
      else if (this.finalScore < 3.5) return 'level-2';
      else return 'level-3';
    },
    severityLabel() {
      if (this.finalScore < 2) return 'Mild';
      else if (this.finalScore < 3.5) return 'Moderate';
      else return 'Critical';
    },
    likelihoodLabel() {
      if (this.finalScore < 2) return 'Unlikely';
      else if (this.finalScore < 3.5) return 'Possible';
      else return 'Very Likely';
    },
    feedbackClass() {
      if (this.finalScore < 2) return 'feedback-mild';
      else if (this.finalScore < 3.5) return 'feedback-moderate';
      else return 'feedback-critical';
    },
    feedbackIcon() {
      if (this.finalScore < 2) return 'bi bi-check-circle-fill';
      else if (this.finalScore < 3.5) return 'bi bi-info-circle-fill';
      else return 'bi bi-exclamation-octagon-fill';
    },
    recommendationText() {
      if (this.finalScore < 2) return 'Your child shows very low risk symptoms. Continue to monitor their wellbeing and maintain open communication. Consider checking in periodically to ensure they continue to feel supported.';
      else if (this.finalScore < 3.5) return 'Your child is showing some signs of emotional distress. Pay closer attention to their behavior and mood. Initiate gentle conversations to understand their feelings better. Document any patterns you notice over the next few weeks.';
      else return 'Your child is showing multiple serious symptoms that require immediate attention. Contact a mental health professional as soon as possible. In crisis situations, don\'t hesitate to reach out to emergency services or crisis hotlines for immediate support.';
    }
  },
  methods: {
    prev() {
      const len = this.columns.length;
      this.startIndex = (this.startIndex - 1 + len) % len;
    },
    next() {
      const len = this.columns.length;
      this.startIndex = (this.startIndex + 1) % len;
    },
    clearSelection() {
      this.selections = Array.from({ length: 5 }, () => Array(5).fill(false));
      this.resultVisible = false;
      this.submissionError = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    submitSelection() {
      if (this.totalSelected < 3 || this.totalSelected > 6) {
        this.submissionError = true;
        this.resultVisible = false;
        return;
      }
      this.submissionError = false;
      const selected = this.selectedItems;
      const severityTable = {
        "Depressive symptoms": 3, "Heightened anxiety": 3, "Loneliness and isolation": 3, "Low self-esteem": 3, "Suicidal ideation": 5,
        "Frequent anger or irritability": 2, "Shame or embarrassment": 3, "Emotional distress and sadness": 3, "Mood swings": 2, "Guilt or self-blame": 2,
        "Avoidance of school or activities": 3, "Declining academic performance": 2, "Changes in device use": 2, "Risky behaviors or substance use": 4, "Loss of interest in personal care or hobbies": 2,
        "Frequent headaches": 1, "Stomach aches or nausea": 1, "Sleep issues or nightmares": 2, "Fatigue and low energy": 2, "Changes in eating habits": 1,
        "Social withdrawal": 3, "Loss of friendships": 2, "Avoidance of social settings": 2, "Distrust of others": 2, "Feeling ostracized": 2
      };
      let total = 0;
      selected.forEach(item => {
        total += severityTable[item.text] || 1;
      });
      this.finalScore = total / selected.length;
      this.resultVisible = true;
      
      this.$nextTick(() => {
        const resultCard = this.$refs.resultCard;
        const offset = 20;
        const bodyRect = document.body.getBoundingClientRect();
        const elementRect = resultCard.getBoundingClientRect();
        const offsetPosition = elementRect.top - bodyRect.top - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    },
    goToSupport() {
      if (this.$router) {
        this.$router.push('/support');
      } else {
        window.location.href = '/support';
      }
    },
    getCategoryColorClass(index) {
      const classes = ['bg-psych', 'bg-emotion', 'bg-behavior', 'bg-physical', 'bg-social'];
      return classes[index] || '';
    },
    getBtnColorClass(index) {
      const classes = ['btn-psych', 'btn-emotion', 'btn-behavior', 'btn-physical', 'btn-social'];
      return classes[index] || '';
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped>
.checker-page {
  background: url('@/assets/background_image.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  overflow-y: auto;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: black; 
  text-shadow: none; 
}

.subtitle {
  margin-bottom: 2rem;
  color: black;
  /* text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); */
}

.container {
  background-color: transparent;
  min-height: 100vh;
}
.symptom-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  width: 300px;
  height: 500px;
  padding: 20px;
  transition: transform 0.3s ease, filter 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
}
.result-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-bottom: 40px; 
}

.card-scroll {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.symptom-card.active {
  transform: scale(1.05);
  border: 2px solid #409eff;
  filter: none;
}
.symptom-card.blurred {
  filter: blur(1px) grayscale(0.3) opacity(0.6);
  pointer-events: none;
}
.card-header {
  text-align: center;
  margin-bottom: 15px;
}
.card-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}
.symptom-option {
  position: relative;
}
.btn-check {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.btn-check:checked + label.symptom-btn {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}
.symptom-btn {
  display: block;
  background: #f3f6fb;
  border: 1px solid #d1dce8;
  border-radius: 10px;
  padding: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.symptom-btn:hover {
  background-color: #d8eafe;
}
.nav-controls {
  margin: 10px auto;
  display: flex;
  justify-content: center;
  gap: 10px;
}
.nav-controls button {
  border: none;
  background: #409eff;
  color: white;
  padding: 10px 16px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
}
.submit-actions {
  margin: 20px auto;
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.clear-btn, .submit-btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}
.clear-btn {
  background: #eee;
  color: #333;
}
.submit-btn {
  background: #409eff;
  color: white;
}
.error-msg {
  color: red;
  margin-top: 1rem;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 8px;
  display: inline-block;
}
.result-bar {
  position: relative;
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}
.result-fill {
  height: 100%;
  transition: width 0.6s ease;
}
.result-ticks span {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: #ccc;
  transform: translateX(-50%);
}
.level-1 { background: #4CAF50; }
.level-2 { background: #FFC107; }
.level-3 { background: #F44336; }
.score-label {
  font-weight: bold;
  margin-bottom: 15px;
}
.result-summary {
  font-size: 15px;
  color: #555;
  margin-bottom: 20px;
}
.result-actions button {
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: #409eff;
  color: white;
  cursor: pointer;
}
.disclaimer-note {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
  background-color: #fdf6e3;
  padding: 12px 16px;
  border-left: 4px solid #fbbc04;
  border-radius: 8px;
  line-height: 1.5;
}
</style>