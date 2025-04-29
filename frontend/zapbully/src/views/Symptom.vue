<template>
  <div class="container mt-4">
    <div class="selector-layout d-flex align-items-center justify-content-center">
      <!-- 左边按钮 -->
      <button class="nav-button btn btn-outline-primary me-3" @click="prev">&lt;</button>

      <!-- 中间症状列 -->
      <div class="symptom-selector-inner d-flex">
        <div
          v-for="(column, index) in visibleColumns"
          :key="(startIndex + index - 1 + columns.length) % columns.length"
          class="symptom-column border p-3 text-center rounded"
          :class="{
            'bg-light': index !== 1,
            'bg-white shadow': index === 1,
            'pointer-events-none opacity-50': index !== 1
          }"
        >
          <h6 class="mb-3">{{ visibleHeaders[index] }}</h6>
          <div
            v-for="(item, i) in column"
            :key="i"
            class="mb-2"
          >
            <input
              type="checkbox"
              class="btn-check"
              :id="`cb-${(startIndex + index - 1 + columns.length) % columns.length}-${i}`"
              :disabled="index !== 1 || (totalSelected >= 6 && !selections[(startIndex + index - 1 + columns.length) % columns.length][i])"
              v-model="selections[(startIndex + index - 1 + columns.length) % columns.length][i]"
              @change="validateSelection((startIndex + index - 1 + columns.length) % columns.length, i)"
              autocomplete="off"
            />
            <label 
              class="btn btn-outline-primary w-100" 
              :for="`cb-${(startIndex + index - 1 + columns.length) % columns.length}-${i}`"
            >
              {{ item }}
            </label>
          </div>
        </div>
      </div>

      <!-- 右边按钮 -->
      <button class="nav-button btn btn-outline-primary ms-3" @click="next">&gt;</button>
    </div>

    <!-- 选择警告 -->
    <div v-if="totalSelected > 0 && totalSelected < 3" class="alert alert-warning mt-3 text-center" role="alert">
      Please select at least 3 symptoms (currently selected: {{ totalSelected }})
    </div>
    <div v-if="totalSelected > 6" class="alert alert-danger mt-3 text-center" role="alert">
      You can select a maximum of 6 symptoms (currently selected: {{ totalSelected }})
    </div>
    <div v-if="totalSelected >= 3 && totalSelected <= 6" class="alert alert-success mt-3 text-center" role="alert">
      Valid selection: {{ totalSelected }} symptom(s)
    </div>

    <!-- 提交按钮 -->
    <div class="d-flex justify-content-center mt-4">
      <button 
        class="btn btn-primary btn-lg" 
        :disabled="totalSelected < 3 || totalSelected > 6"
        @click="submitSelection"
      >
        Submit
      </button>
    </div>

    <!-- 结果展示 -->
    <div v-if="resultVisible" class="mt-5">
      <h4 class="text-center mb-3">Result Analysis</h4>

      <div class="progress mb-3" style="height: 30px;">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: finalScore * 20 + '%' }"
          :class="progressBarClass"
        >
          Severity Score: {{ finalScore.toFixed(1) }} / 5
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
      headers: [
        "Psychological",
        "Emotional",
        "Behavioral",
        "Physical",
        "Social"
      ],
      startIndex: 0,
      selections: Array.from({ length: 5 }, () => Array(5).fill(false)),
      fromResultPage: false,
      resultVisible: false,
      finalScore: 0
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
      return this.selections.reduce((total, column) => {
        return total + column.filter(item => item).length;
      }, 0);
    },
    selectedItems() {
      const selected = [];
      this.selections.forEach((column, colIndex) => {
        column.forEach((isSelected, itemIndex) => {
          if (isSelected) {
            selected.push({
              text: this.columns[colIndex][itemIndex],
              column: colIndex,
              row: itemIndex
            });
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
    validateSelection(columnIndex, itemIndex) {
      if (this.totalSelected > 6) {
        this.selections[columnIndex][itemIndex] = false;
      }
      this.saveSelectionsToStorage();
    },
    saveSelectionsToStorage() {
      sessionStorage.setItem('userSelections', JSON.stringify({
        selections: this.selections,
        startIndex: this.startIndex
      }));
      sessionStorage.setItem('selectionInProgress', 'true');
    },
    loadSelectionsFromStorage() {
      const savedData = sessionStorage.getItem('userSelections');
      if (savedData && !this.fromResultPage) {
        const data = JSON.parse(savedData);
        this.selections = data.selections;
        this.startIndex = data.startIndex;
      }
    },
    clearSelections() {
      this.selections = Array.from({ length: 5 }, () => Array(5).fill(false));
      sessionStorage.removeItem('userSelections');
      sessionStorage.removeItem('selectionInProgress');
    },
    submitSelection() {
      if (this.totalSelected >= 3 && this.totalSelected <= 6) {
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
      }
    },
    goToSupport() {
      if (this.$router) {
        this.$router.push('/support');
      } else {
        window.location.href = '/support';
      }
    },
    handlePageShow() {
      if (sessionStorage.getItem('navigatedToResult') === 'true') {
        this.fromResultPage = true;
        this.clearSelections();
        sessionStorage.removeItem('navigatedToResult');
      }
    }
  },
  created() {
    this.loadSelectionsFromStorage();
  },
  mounted() {
    window.addEventListener('pageshow', this.handlePageShow);
  },
  beforeDestroy() {
    window.removeEventListener('pageshow', this.handlePageShow);
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
</style>
