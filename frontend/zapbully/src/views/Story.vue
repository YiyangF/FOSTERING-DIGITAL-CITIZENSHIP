<template>
  <div class="story-container" v-if="step" @click="handleClick">
    <div
      class="scene"
      :style="{ backgroundImage: 'url(' + step.background + ')' }"
      :key="step.background"
    >
      <transition-group name="fade" tag="div" class="character-group">
        <img
          v-for="(char, i) in step.characters"
          :key="i + '-' + char.img"
          :src="char.img"
          class="character"
          :style="char.style"
          :class="char.effect || 'fade'"
        />
      </transition-group>

      <div class="phone-wrapper" v-if="showPhone">
        <img src="/phone.png" class="phone-frame" />
        <div ref="chatContainer" class="chat-content">
          <div
            v-for="(message, index) in visibleMessages"
            :key="index"
            class="message-bubble"
            :class="message.name"
          >
            <div class="sender">{{ message.name }}</div>
            <div class="text">{{ message.text }}</div>
          </div>
        </div>
      </div>

      <div class="dialogue-box" v-if="step.text && !hideTextBox" @click.stop>
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
      currentStepIndex: 0,
      clickEnabled: true,
      showPhone: false,
      visibleMessages: [],
      currentMessageIndex: 0,
      typing: false,
      readyForNext: false,
      hideTextBox: false,
    };
  },
  computed: {
    step() {
      return this.story?.steps[this.currentStepIndex];
    }
  },
  watch: {
    step(newStep) {
      if (!newStep) return;

      this.resetChat();

      if (newStep.chat) {
        this.startChat();
      } else {
        this.showPhone = false;
        this.hideTextBox = false;
      }

      // Apply any initial character effects immediately
      this.applyCharacterEffect('onEnter');
    }
  },
  methods: {
    async loadStory() {
      const storyId = this.$route.params.storyId;
      try {
        const module = await import(`@/assets/stories/story${storyId}.json`);
        this.story = module.default;
      } catch (err) {
        console.error(`Could not load story${storyId}.json`, err);
      }
    },
    goToStep(index) {
      this.resetChat();
      this.currentStepIndex = index;
    },
    handleClick() {
      if (!this.clickEnabled) return;

      if (!this.step.choices && this.step.next !== undefined) {
        this.goToStep(this.step.next);
      }
    },
    startChat() {
      setTimeout(() => {
        this.hideTextBox = true;
        this.showPhone = true;
        this.typing = true;
        this.clickEnabled = false;

        const totalMessages = this.step.messages?.length || 0;
        const totalDuration = 10000; // Total chat time
        const interval = totalMessages > 0 ? totalDuration / totalMessages : totalDuration;

        const messageTimer = setInterval(() => {
          if (this.currentMessageIndex >= totalMessages) {
            clearInterval(messageTimer);
            this.typing = false;
            this.readyForNext = true;
            this.clickEnabled = true;
          } else {
            this.typing = true;
            const messageToAdd = this.step.messages[this.currentMessageIndex];

            setTimeout(() => {
              this.visibleMessages.push(messageToAdd);
              this.typing = false;

              // Scroll to bottom
              this.$nextTick(() => {
                const chatContainer = this.$refs.chatContainer;
                if (chatContainer) {
                  chatContainer.scrollTop = chatContainer.scrollHeight;
                }
              });

              // Mid-chat image switch if needed
              if (this.step.characterEffect?.switchAtMessage === this.currentMessageIndex) {
                this.applyCharacterEffect('switch');
              }

            }, 200);

            this.currentMessageIndex++;
          }
        }, interval);

      }, this.step.chatDelay || 2000);
    },
    applyCharacterEffect(when) {
      if (!this.step.characterEffect) return;

      const { onEnterImage, switchImage, switchAtMessage } = this.step.characterEffect;

      if (when === 'onEnter' && onEnterImage && this.step.characters?.length > 0) {
        this.step.characters[0].img = onEnterImage;
      }

      if (when === 'switch' && switchImage && this.step.characters?.length > 0) {
        this.step.characters[0].img = switchImage;
      }
    },
    resetChat() {
      this.showPhone = false;
      this.visibleMessages = [];
      this.currentMessageIndex = 0;
      this.typing = false;
      this.clickEnabled = true;
      this.hideTextBox = false;
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
.character-group {
  position: relative;
  width: 100%;
  height: 100%;
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

.phone-wrapper {
  position: relative;
  margin: 0 auto;
  transform: translateX(-50%);
  width: 24%;
}

.phone-frame {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-content {
  position: absolute;
  top: 90px;
  left: 30px;
  right: 30px;
  bottom: 90px;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 90%;
  word-break: break-word;
}

.message-bubble.Jake { background-color: #d9f4ff; }
.message-bubble.Liam { background-color: #ffd9d9; }
.message-bubble.Tyler { background-color: #ecffd9; }
.message-bubble.Coach { background-color: #d9f4ff; }

.sender {
  font-weight: bold;
}
.text {
  margin-top: 4px;
}
</style>
