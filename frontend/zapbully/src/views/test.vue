<template>
 <!-- Show quiz only when showTest is true -->
  <transition name="fade" mode="out-in">
    <div>
      <div v-if="!quizCompleted" class="question-box" :key="currentQuestionIndex">
        <h2>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</h2>
        <p class="question-text">{{ currentQuestion.text }}</p>
        <div class="buttons">
          <button class="yes-button" @click="answer(true)">Yes</button>
          <button class="no-button" @click="answer(false)">No</button>
        </div>
      </div>

      <div v-else class="result-box" key="result">
        <h2>Quiz Completed 🎉</h2>
        <p>Your score: {{ score }} / {{ questions.length * 2 }}</p>
        <p>{{ feedback }}</p>
        <div class="result-buttons">
    <div class="left-button-box">
      <button class="restart-button" @click="restart">Restart</button>
    </div>
    <div class="right-button-box">
      <button class="simulator-button" @click="goToSimulator">Try the Simulator</button>

     <!-- <button class="simulator-button" @click="$emit('close')">Try the Simulator</button> -->
    </div>
  </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      currentQuestionIndex: 0,
      score: 0,
      quizCompleted: false,
      questions: [
        { text: "Do you know which apps or websites your child uses most often?" },
        { text: "Do you know who your child interacts with online?" },
        { text: "Have you talked to your child about cyberbullying?" },
        { text: "Do you think your child would tell you if they had a problem online?" },
        { text: "Have you set screen time rules or internet usage limits for your child?" }
      ]
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    progressPercent() {
      return (this.currentQuestionIndex / this.questions.length) * 100;
    },
    feedback() {
      const max = this.questions.length * 2;
      if (this.score >= 8) return "You are very engaged with your child's online activities. Keep it up!";
      if (this.score >= 4) return "You have some understanding, but there's room to improve.";
      return "You might not be fully aware of your child's online world. It's time to talk more with them.";
    }
  },
  methods: {
    answer(isYes) {
      if (isYes) this.score += 2;
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex >= this.questions.length) {
        this.quizCompleted = true;
      }
    },
    restart() {
      this.score = 0;
      this.currentQuestionIndex = 0;
      this.quizCompleted = false;
    },
    goToSimulator() {
      this.$router.push("/simulator");
    }
  }
};
</script>

<style scoped>
/* === container === */
.quiz-container {
  max-width: 520px;
  margin: 60px auto;
  padding: 30px;
  border: 2px solid #dcdcdc;
  border-radius: 15px;
  background-color: #fff;
  font-family: 'Segoe UI', sans-serif;
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

/* === progress line === */
.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
}

.progress-fill {
  height: 100%;
  background-color: #91a6fa;
  width: 0%;
  transition: width 0.5s ease-in-out;
}

/* === quiz === */
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.question-text {
  font-size: 20px;
  margin: 20px 0;
  color: #444;
}

/* === button container === */
.buttons {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 20px;
}

/* === gerneral button=== */
button {
  min-width: 150px;
  padding: 14px 0;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* ✅ Yes  */
.yes-button {
  background-color: #4CAF50;
}
.yes-button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

/* ❌ No  */
.no-button {
  background-color: #f7a440;
}
.no-button:hover {
  background-color: #e58b20;
  transform: scale(1.05);
}

/* 🔁 Restart  */
.result-buttons {
  display: flex;
  flex-direction: column; /* ✅ 上下排列 */
  gap: 10px;               /* ✅ 关键点：拉开上下距离 */
  margin-top: 30px;
}

.restart-button {
  background-color: #607d8b;
}
.restart-button:hover {
  background-color: #546e7a;
  transform: scale(1.05);
}

/* === animation=== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.simulator-button {
  background-color: #3f51b5;
}
.simulator-button:hover {
  background-color: #303f9f;
  transform: scale(1.05);
}

</style>
