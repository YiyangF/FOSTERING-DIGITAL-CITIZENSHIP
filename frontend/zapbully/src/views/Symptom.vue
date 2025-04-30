<template>
  <div class="symptom-checker-page">
    <div class="container mt-4">
      <h2 class="text-center fw-bold mb-2">Emotional Distress Symptom Checker</h2>
      <p class="text-center text-muted mb-4">
        Select <strong>3 to 6</strong> symptoms your child may be experiencing. The tool will assess severity and provide guidance.
      </p>

      <div class="selector-layout d-flex align-items-center justify-content-center">
        <button class="nav-button btn btn-outline-primary me-3" @click="prev">&lt;</button>

        <div class="symptom-selector-inner d-flex">
          <div
            v-for="(column, index) in visibleColumns"
            :key="(startIndex + index - 1 + columns.length) % columns.length"
            class="symptom-column border p-3 text-center rounded"
            :class="[
              index !== 1 ? 'bg-light pointer-events-none opacity-50' : '',
              getCategoryColorClass((startIndex + index - 1 + columns.length) % columns.length)
            ]"
          >
            <h6 class="mb-3">{{ visibleHeaders[index] }}</h6>
            <img 
              :src="categoryIcons[visibleHeaders[index]]" 
              :alt="visibleHeaders[index] + ' icon'"
              class="category-icon mb-3"
            />
            <div v-for="(item, i) in column" :key="i" class="mb-2">
              <input
                type="checkbox"
                class="btn-check"
                :id="`cb-${(startIndex + index - 1 + columns.length) % columns.length}-${i}`"
                :disabled="index !== 1 || (totalSelected >= 6 && !selections[(startIndex + index - 1 + columns.length) % columns.length][i])"
                v-model="selections[(startIndex + index - 1 + columns.length) % columns.length][i]"
                autocomplete="off"
              />
              <label
                class="btn w-100 symptom-btn"
                :class="getBtnColorClass((startIndex + index - 1 + columns.length) % columns.length)"
                :for="`cb-${(startIndex + index - 1 + columns.length) % columns.length}-${i}`"
              >
                {{ item }}
              </label>
            </div>
          </div>
        </div>

        <button class="nav-button btn btn-outline-primary ms-3" @click="next">&gt;</button>
      </div>

      <div class="d-flex justify-content-center mt-4 gap-3">
        <button class="btn btn-outline-secondary btn-lg" @click="clearSelection">
          Clear
        </button>
        <button class="btn btn-primary btn-lg" @click="submitSelection">
          Submit
        </button>
      </div>

      <div v-if="submissionError" class="alert alert-danger text-center mt-3">
        Please select between 3 and 6 symptoms before submitting.
      </div>

      <div v-if="resultVisible" class="mt-5 result-container">
        <h4 class="text-center mb-3">Severity Analysis Based on Selected Symptoms</h4>
        
        <div class="severity-meter mb-4">
          <div class="progress-container">
            <div class="progress-bg">
              <div
                class="progress-fill"
                :style="{ width: finalScore * 20 + '%' }"
                :class="progressBarClass"
              ></div>
            </div>
            <div class="severity-markers">
              <span v-for="n in 5" :key="n" :class="{ active: finalScore >= n }"></span>
            </div>
            <div class="severity-labels">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
          <div class="severity-score">
            <strong>{{ finalScore.toFixed(1) }}/5</strong>
            <span>{{ severityLabel }} Severity</span>
          </div>
        </div>

        <div class="result-feedback p-4 rounded" :class="feedbackClass">
          <div class="d-flex align-items-center mb-3">
            <div class="feedback-icon me-3">
              <i :class="feedbackIcon"></i>
            </div>
            <h5 class="mb-0">{{ severityLabel }} ({{ likelihoodLabel }})</h5>
          </div>
          <p class="mb-0">{{ recommendationText }}</p>
        </div>

        <div class="action-buttons mt-4">
          <button class="btn btn-outline-primary me-2" @click="clearSelection">
            Start New Assessment
          </button>
          <button class="btn btn-primary" @click="goToSupport">
            Get Support Resources
          </button>
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
      submissionError: false
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
  }
};
</script>

<style scoped>
.pointer-events-none {
  pointer-events: none;
}
.selector-layout {
  gap: 1rem;
}
.symptom-column {
  min-height: 550px;
  width: 280px;
  display: flex;
  flex-direction: column;
}
.btn {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  white-space: normal;
  word-break: break-word;
  transition: all 0.2s ease;
  border-width: 2px;
}
.symptom-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.symptom-column h6 {
  font-size: 20px;
  margin-bottom: 1rem;
  font-weight: 700;
}
.nav-button {
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.category-icon {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin: 0 auto 1rem;
  display: block;
}

/* Background colors for columns */
.bg-psych { background-color: #f0f9ff; }
.bg-emotion { background-color: #fff7e6; }
.bg-behavior { background-color: #f9f0ff; }
.bg-physical { background-color: #e6fffb; }
.bg-social { background-color: #f6ffed; }

/* Button colors for each category */
.btn-psych {
  color: #0369a1;
  border-color: #0369a1;
}
.btn-psych:hover, .btn-check:checked + .btn-psych {
  background-color: #0369a1;
  color: white;
}

.btn-emotion {
  color: #a16207;
  border-color: #a16207;
}
.btn-emotion:hover, .btn-check:checked + .btn-emotion {
  background-color: #a16207;
  color: white;
}

.btn-behavior {
  color: #7e22ce;
  border-color: #7e22ce;
}
.btn-behavior:hover, .btn-check:checked + .btn-behavior {
  background-color: #7e22ce;
  color: white;
}

.btn-physical {
  color: #0d9488;
  border-color: #0d9488;
}
.btn-physical:hover, .btn-check:checked + .btn-physical {
  background-color: #0d9488;
  color: white;
}

.btn-social {
  color: #3f6212;
  border-color: #3f6212;
}
.btn-social:hover, .btn-check:checked + .btn-social {
  background-color: #3f6212;
  color: white;
}

/* Enhanced Progress Bar */
.severity-meter {
  max-width: 600px;
  margin: 0 auto;
}
.progress-container {
  position: relative;
  margin-bottom: 40px;
}
.progress-bg {
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  transition: width 0.6s ease;
}
.severity-markers {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}
.severity-markers span {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ddd;
  transform: translateY(10px);
}
.severity-markers span.active {
  background-color: #333;
}
.severity-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  font-size: 14px;
  font-weight: 500;
}
.severity-labels span {
  flex: 1;
  text-align: center;
}
.severity-score {
  text-align: center;
  margin-top: 15px;
}
.severity-score strong {
  font-size: 24px;
  display: block;
  margin-bottom: 5px;
}

/* Progress bar levels */
.level-1 { background-color: #4caf50; } /* Green */
.level-2 { background-color: #2196f3; } /* Blue */
.level-3 { background-color: #f44336; } /* Red */

/* Enhanced Feedback Section */
.result-feedback {
  max-width: 600px;
  margin: 0 auto 30px;
  border-left: 5px solid;
}
.feedback-mild {
  background-color: #e8f5e9;
  border-color: #4caf50;
}
.feedback-moderate {
  background-color: #e3f2fd;
  border-color: #2196f3;
}
.feedback-critical {
  background-color: #ffebee;
  border-color: #f44336;
}
.feedback-icon {
  font-size: 28px;
}
.feedback-icon .bi-check-circle-fill { color: #4caf50; }
.feedback-icon .bi-info-circle-fill { color: #2196f3; }
.feedback-icon .bi-exclamation-octagon-fill { color: #f44336; }

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.symptom-checker-page {
  min-height: 100vh;
  padding: 40px 0;
  background: linear-gradient(to bottom right, #e6f2ff, #d0e3f7);
  background-image: url('@/assets/background_image.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-blend-mode: overlay;
}
</style>