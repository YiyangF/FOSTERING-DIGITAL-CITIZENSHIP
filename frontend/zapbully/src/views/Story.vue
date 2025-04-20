<template>
  <div class="story-container" v-if="step" @click="handleClick">
    <div
      class="scene"
      :style="{ backgroundImage: 'url(' + step.background + ')' }"
      :key="step.background"
    >
    <transition-group name="fade" tag="div">
      <img
        v-for="(char, i) in step.characters"
        :key="i + '-' + char.img"
        :src="char.img"
        class="character"
        :style="char.style"
      />
    </transition-group>

      <div class="dialogue-box" @click.stop>
        <p><strong>{{ step.name }}:</strong> {{ step.text }}</p>
        <div class="choices" v-if="step.choices">
          <button
            v-for="(choice, index) in step.choices"
            :key="index"
            @click="goToStep(choice.next)"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>
    </div>
    
    <router-link to="/safety-simulations" class="back-btn">← Back to stories</router-link>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      story: null,
      currentStepIndex: 0
    };
  },
  computed: {
    step() {
      return this.story?.steps[this.currentStepIndex];
    }
  },
  methods: {
    goToStep(index) {
      this.currentStepIndex = index;
    },
    handleClick() {
      if (!this.step.choices && this.step.next !== undefined) {
        this.goToStep(this.step.next);
      }
    },
    async loadStory() {
      const storyId = this.$route.params.storyId;
      try {
        const module = await import(`@/assets/stories/story${storyId}.json`);
        this.story = module.default;
      } catch (err) {
        console.error(`Could not load story${storyId}.json`, err);
      }
    }
  },
  mounted() {
    this.loadStory();
  }
};
</script>
  
<style scoped>
.story-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.character {
  position: absolute;
  bottom: 0;
  left: 30px;
  height: 300px;
  transition: opacity 0.5s ease;
}
.scene {
  position: relative;
  width: 100%;
  height: 500px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
}
.dialogue-box {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background: rgba(255, 255, 255, 0.95);
  padding: 16px;
  border-radius: 10px;
}
.choices button {
  margin: 8px 8px 0 0;
  padding: 8px 12px;
  background: #29b6f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.choices button:hover {
  background: #0288d1;
}
.back-btn {
  align-self: flex-start;
  display: inline-block;
  padding: 8px 14px;
  background: #ffa726;
  color: white;
  text-decoration: none;
  border-radius: 6px;
}
</style>