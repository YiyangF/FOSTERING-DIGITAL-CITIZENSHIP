<template>
  <div class="story-container" v-if="step" @click="handleClick">
    <div class="scene-wrapper">

      <div 
        class="scene"
        :style="{ backgroundImage: 'url(' + step.background + ')' }"
        :class="{ 'with-transition': !step.preserveBackground }"
      >
        <div class="character-group">
          <transition-group name="char-fade">
            <img
              v-for="(char, i) in characters"
              :key="i + '-' + char.img"
              :src="char.img"
              class="character"
              :style="char.style"
              :class="{ 'fade-transition': shouldFadeCharacter }"
            />
          </transition-group>
        </div>

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
    </div>

    <div class="button-group">
      <router-link to="/safety-simulations" class="back-btn">← Back to stories</router-link>
      <button class="mute-btn" @click.stop="toggleMute">
        {{ isMuted ? "🔇" : "🔈" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      story: null,
      currentStepIndex: 0,
      previousStepIndex: null,
      characters: [],
      clickEnabled: true,
      showPhone: false,
      visibleMessages: [],
      currentMessageIndex: 0,
      typing: false,
      readyForNext: false,
      hideTextBox: false,
      isMuted: false,
      transitionInProgress: false,
      shouldFadeCharacter: false,
      prevBackground: null
    };
  },
  computed: {
    step() {
      return this.story?.steps[this.currentStepIndex];
    }
  },
  watch: {
    step(newStep, oldStep) {
      if (!newStep) return;
      
      this.shouldFadeCharacter = newStep.transitionEffect === "fade";

      if (oldStep && newStep.preserveBackground && oldStep.background === newStep.background) {
        // Same background, no transition needed
      } else {
        this.prevBackground = oldStep ? oldStep.background : null;
      }
      
      // Initialize character positions
      this.characters = JSON.parse(JSON.stringify(newStep.characters || []));
      this.resetChat();

      if (newStep.chat) {
        this.startChat();
      } else {
        this.showPhone = false;
        this.hideTextBox = false;
      }

      this.speakStepText();
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
      if (this.transitionInProgress) return;
      
      this.transitionInProgress = true;
      this.previousStepIndex = this.currentStepIndex;
      
      // Get current and next step
      const currentStep = this.step;
      const nextStep = this.story.steps[index];
      
      if (nextStep && nextStep.preserveBackground && currentStep && currentStep.background === nextStep.background) {
        // Same background - quick transition without fading
        this.resetChat();
        this.currentStepIndex = index;
        this.transitionInProgress = false;
      } else {
        // Different background - need transition with delay
        setTimeout(() => {
          this.resetChat();
          this.currentStepIndex = index;
          this.transitionInProgress = false;
        }, 300);
      }
    },
    handleClick() {
      if (!this.clickEnabled || this.transitionInProgress) return;

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
        if (totalMessages === 0) {
          this.typing = false;
          this.clickEnabled = true;
          return;
        }

        const totalDuration = 5000;
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

              this.$nextTick(() => {
                const chatContainer = this.$refs.chatContainer;
                if (chatContainer) {
                  chatContainer.scrollTop = chatContainer.scrollHeight;
                }
              });

              if (this.step.characterSwitch && 
                  this.step.characterSwitch.atMessageIndex === this.currentMessageIndex) {
                this.switchCharacterImage(this.step.characterSwitch.image);
              }

              this.currentMessageIndex++;
            }, 200);
          }
        }, interval);

      }, this.step.chatDelay || 3000);
    },
    switchCharacterImage(newImage) {
      if (!newImage || !this.characters.length) return;
      
      this.characters = this.characters.map((char, index) => {
        if (index === 0) {
          return { ...char, img: newImage };
        }
        return char;
      });
    },
    resetChat() {
      this.showPhone = false;
      this.visibleMessages = [];
      this.currentMessageIndex = 0;
      this.typing = false;
      this.clickEnabled = true;
      this.hideTextBox = false;
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        window.speechSynthesis.cancel();
      } else {
        this.speakStepText();
      }
    },
    speakStepText() {
      if (this.isMuted || !this.step?.text) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(`${this.step.name}: ${this.step.text}`);
      utterance.voice = this.pickVoice(this.step.voice); // get voice from JSON
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    },
    pickVoice(voiceName) {
      const voices = window.speechSynthesis.getVoices();
      return voices.find(v => v.name === voiceName) || voices[0];
    },
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

.scene-wrapper {
  position: relative;
  height: 500px;
  overflow: hidden;
  border-radius: 12px;
}

.scene {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

/* New class for background transitions only when needed */
.with-transition {
  transition: background-image 0.3s ease;
}

.fade-transition {
  transition: opacity 0.5s ease;
}

.char-fade-enter-active,
.char-fade-leave-active {
  transition: opacity 0.4s ease;
}

.char-fade-enter-from,
.char-fade-leave-to {
  opacity: 0;
}

.character-group {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.character {
  position: absolute;
  bottom: 0;
  height: 300px;
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

.button-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.back-btn {
  margin-bottom: 16px;
  padding: 8px 14px;
  background-color: #ffa726;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #fb8c00;
}

.mute-btn {
  margin-bottom: 16px;
  padding: 8px 14px;
  background: #90caf9;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
}

.mute-btn:hover {
  background: #64b5f6;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-content::-webkit-scrollbar {
  display: none;
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
.message-bubble.Coach { background-color: #d7f0f7; }

.sender {
  font-weight: bold;
}

.text {
  margin-top: 4px;
}
</style>