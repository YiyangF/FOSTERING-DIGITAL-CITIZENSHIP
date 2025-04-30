<template>
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
            index !== 1 ? 'bg-light pointer-events-none opacity-50' : 'bg-white shadow',
            getCategoryColorClass((startIndex + index - 1 + columns.length) % columns.length)
          ]"
        >
          <h6 class="mb-3">{{ visibleHeaders[index] }}</h6>
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
              class="btn btn-outline-primary w-100 symptom-btn"
              :for="`cb-${(startIndex + index - 1 + columns.length) % columns.length}-${i}`"
            >
              {{ item }}
            </label>
          </div>
        </div>
      </div>

      <button class="nav-button btn btn-outline-primary ms-3" @click="next">&gt;</button>
    </div>

    <div class="d-flex justify-content-center mt-4">
      <button class="btn btn-primary btn-lg" @click="submitSelection">
        Submit
      </button>
    </div>

    <div v-if="submissionError" class="alert alert-danger text-center mt-3">
      Please select between 3 and 6 symptoms before submitting.
    </div>

    <div v-if="resultVisible" class="mt-5">
      <h4 class="text-center mb-3">Severity Analysis Based on Selected Symptoms</h4>
      <div class="progress position-relative mb-3" style="height: 30px;">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          :style="{ width: finalScore * 20 + '%' }"
          :class="progressBarClass"
        ></div>
        <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
          <strong class="text-dark">
            {{ finalScore.toFixed(1) }}/5 – {{ severityLabel }}
          </strong>
        </div>
      </div>

      <div class="text-center mb-4">
        <h5 :class="textClass">{{ severityLabel }} ({{ likelihoodLabel }})</h5>
        <p :class="textClass">{{ recommendationText }}</p>
      </div>

      <div class="d-flex justify-content-center">
        <button class="btn btn-outline-primary" @click="goToSupport">
          Visit Parental Support Page
        </button>
      </div>
    </div>
  </div>
</template>

<script>
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
      if (this.finalScore < 1.5) return 'bg-success';
      else if (this.finalScore < 2.5) return 'bg-info';
      else if (this.finalScore < 3.5) return 'bg-warning text-dark';
      else return 'bg-danger';
    },
    severityLabel() {
      if (this.finalScore < 1.5) return 'Mild';
      else if (this.finalScore < 2.5) return 'Moderate';
      else if (this.finalScore < 3.5) return 'Elevated';
      else return 'Critical';
    },
    likelihoodLabel() {
      if (this.finalScore < 1.5) return 'Unlikely';
      else if (this.finalScore < 2.5) return 'Possible';
      else if (this.finalScore < 3.5) return 'Likely';
      else return 'Very Likely';
    },
    textClass() {
      if (this.finalScore < 1.5) return 'text-success';
      else if (this.finalScore < 2.5) return 'text-info';
      else if (this.finalScore < 3.5) return 'text-warning';
      else return 'text-danger';
    },
    recommendationText() {
      if (this.finalScore < 1.5) return 'Very low risk symptoms detected. Encourage continued healthy behavior.';
      else if (this.finalScore < 2.5) return 'Some concern noted. Stay attentive and supportive in daily interactions.';
      else if (this.finalScore < 3.5) return 'Elevated concern. Engage in meaningful conversations and observe changes.';
      else return 'Critical concern. Professional intervention is strongly advised as soon as possible.';
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
    }
  }
};
</script>

<style scoped>
.pointer-events-none {
  pointer-events: none;
}
.btn-check:checked + .btn-outline-primary {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.selector-layout {
  gap: 1rem;
}
.symptom-column {
  min-height: 450px;
  width: 220px;
  display: flex;
  flex-direction: column;
}
.btn-outline-primary {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  white-space: normal;
  word-break: break-word;
  transition: transform 0.2s ease;
}
.symptom-btn:hover {
  transform: scale(1.03);
}
.symptom-column h6 {
  font-size: 18px;
  margin-bottom: 1rem;
}
.nav-button {
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-psych { background-color: #f0f9ff; }
.bg-emotion { background-color: #fff7e6; }
.bg-behavior { background-color: #f9f0ff; }
.bg-physical { background-color: #e6fffb; }
.bg-social { background-color: #f6ffed; }
</style>
