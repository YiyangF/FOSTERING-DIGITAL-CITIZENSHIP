<template>
  <div class="story-container" v-if="step" @click="handleClick">
    <!-- Top navigation bar with buttons and interactive progress bar -->
    <div class="top-navigation">
      <router-link to="/safety-simulations" class="back-btn">← Back</router-link>
      
      <!-- Interactive Progress Bar with Navigation Dots -->
      <div class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progressPercentage}%` }"
          ></div>
          
          <!-- Navigation dots for key steps with custom tooltips -->
          <div class="progress-dots">
            <div 
              v-for="keyStep in keyStepsArray" 
              :key="keyStep.id"
              class="progress-dot"
              :class="{ 
                'active': visitedKeySteps.has(keyStep.id),
                'current': currentStepIndex === keyStep.id
              }"
              :style="{ left: `${calculateDotPosition(keyStep)}%` }"
              @click.stop="handleDotClick(keyStep)"
              :title="keyStep.customTooltip || generateDotTooltip(keyStep)"
            ></div>
          </div>
        </div>
        <div class="progress-text">{{ completedKeySteps }} / {{ story?.keySteps || 1 }}</div>
      </div>
      
      <button class="mute-btn" @click.stop="toggleMute">
        {{ isMuted ? "🔇" : "🔈" }}
      </button>
    </div>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-box">
        <h3>{{ popupData?.title || 'Notice' }}</h3>
        <p>{{ popupData?.message || '' }}</p>
        <button @click="closePopup">{{ popupData?.buttonText || 'OK' }}</button>
      </div>
    </div>

    <div v-if="showInstructions" class="instruction-overlay">
      <!-- Close button -->
      <div class="close-button" @click.stop="closeInstructions">
        <div class="close-icon">✕</div>
        <div class="close-label">Close to Start!</div>
      </div>
      
      <!-- Dialog box callout -->
      <div class="callout callout-dialog">
        <div class="callout-text">Dialog box</div>
      </div>
      
      <!-- Who is speaking callout -->
      <div class="callout callout-who">
        <div class="callout-text">Who is saying</div>
      </div>
      
      <!-- Click to continue callout -->
      <div class="callout callout-click">
        <div class="callout-text">After starting, Click anywhere on the screen to Continue the story</div>
      </div>
      
      <!-- New callout for progress dots -->
      <div class="callout callout-dots">
        <div class="callout-text">Click dots to navigate to visited scenes</div>
      </div>
    </div>

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
  </div>
</template>

<script>
export default {
  props: ['title', 'message', 'buttonText'],
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
      prevBackground: null,
      showInstructions: true,
      completedKeySteps: 0,
      progressPercentage: 0,
      visitedKeySteps: new Set(),
      keyStepsArray: [],
      furthestVisitedStep: 0,
      popupData: null,
      showPopup: false
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
        // Same background
      } else {
        this.prevBackground = oldStep ? oldStep.background : null;
      }

      this.characters = JSON.parse(JSON.stringify(newStep.characters || []));
      this.resetChat();

      if (newStep.chat) {
        this.startChat();
      } else {
        this.showPhone = false;
        this.hideTextBox = false;
      }

      if (this.currentStepIndex > this.furthestVisitedStep) {
        this.furthestVisitedStep = this.currentStepIndex;
      }

      if (newStep.isKeyStep && !this.visitedKeySteps.has(newStep.id)) {
        this.visitedKeySteps.add(newStep.id);
        this.completedKeySteps = this.visitedKeySteps.size;
        this.updateProgress();
      }

      if (!this.showInstructions) {
        this.speakStepText();
      }

      // Updated: First reset popup then set new popup data if exists
      this.showPopup = false;
      this.$nextTick(() => {
        this.updatePopup(newStep);
      });
    }
  },
  methods: {
    updatePopup(step) {
      if (step && step.popup) {
        this.popupData = { ...step.popup };
        // Small delay to ensure DOM update before showing popup
        setTimeout(() => {
          this.showPopup = true;
        }, 50);
      } else {
        this.popupData = null;
        this.showPopup = false;
      }
    },
    // Added dedicated method for closing popup
    closePopup() {
      this.showPopup = false;
    },
    async loadStory() {
      const storyId = this.$route.params.storyId;
      try {
        const module = await import(`@/assets/stories/story${storyId}.json`);
        this.story = module.default;

        this.completedKeySteps = 0;
        this.visitedKeySteps = new Set();
        this.furthestVisitedStep = 0;

        // Updated to include custom tooltip text from stepText property
        this.keyStepsArray = this.story.steps
          .filter(step => step.isKeyStep)
          .map(step => ({
            id: step.id,
            name: step.name || "Scene",
            text: step.text ? step.text.substring(0, 30) + (step.text.length > 30 ? "..." : "") : "Scene",
            customTooltip: step.stepText || null // Use stepText for custom tooltip if available
          }));

        if (this.step && this.step.isKeyStep) {
          this.visitedKeySteps.add(this.step.id);
          this.completedKeySteps = 1;
        }

        this.updateProgress();
        if (this.step) this.updatePopup(this.step);
      } catch (err) {
        console.error(`Could not load story${storyId}.json`, err);
      }
    },
    
    generateDotTooltip(keyStep) {
      // This is the fallback tooltip if no custom one is provided
      const stepNumber = this.keyStepsArray.findIndex(ks => ks.id === keyStep.id) + 1;
      return `Scene ${stepNumber}: ${keyStep.name !== " " ? keyStep.name : ""}`;
    },
    calculateDotPosition(keyStep) {
      const keyStepIndex = this.keyStepsArray.findIndex(ks => ks.id === keyStep.id);
      if (keyStepIndex === -1) return 0;
      return (keyStepIndex / (this.keyStepsArray.length - 1)) * 100;
    },
    generateDotTooltip(keyStep) {
      const stepNumber = this.keyStepsArray.findIndex(ks => ks.id === keyStep.id) + 1;
      return `Scene ${stepNumber}: ${keyStep.name !== " " ? keyStep.name : ""}`;
    },
    handleDotClick(keyStep) {
      if (this.visitedKeySteps.has(keyStep.id) || keyStep.id <= this.furthestVisitedStep) {
        this.goToStep(keyStep.id);
      }
    },
    updateProgress() {
      if (!this.story || !this.story.keySteps) return;
      this.progressPercentage = (this.completedKeySteps / this.story.keySteps) * 100;
    },
    closeInstructions() {
      this.showInstructions = false;
      this.speakStepText();
    },
    goToStep(index) {
      if (this.transitionInProgress) return;

      this.transitionInProgress = true;
      this.previousStepIndex = this.currentStepIndex;

      const currentStep = this.step;
      const nextStep = this.story.steps[index];

      const updateStep = () => {
        this.resetChat();
        this.currentStepIndex = index;

        if (index > this.furthestVisitedStep) {
          this.furthestVisitedStep = index;
        }

        if (nextStep.isKeyStep && !this.visitedKeySteps.has(nextStep.id)) {
          this.visitedKeySteps.add(nextStep.id);
          this.completedKeySteps = this.visitedKeySteps.size;
          this.updateProgress();
        }

        this.transitionInProgress = false;
        this.updatePopup(nextStep);
      };

      if (nextStep && nextStep.preserveBackground && currentStep && currentStep.background === nextStep.background) {
        updateStep();
      } else {
        setTimeout(updateStep, 300);
      }
    },
    handleClick() {
      if (this.showPopup || this.showInstructions || !this.clickEnabled || this.transitionInProgress) return;

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
      if (this.isMuted || !this.step?.text || this.showInstructions) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(`${this.step.name}: ${this.step.text}`);
      utterance.voice = this.pickVoice(this.step.voice);
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

    if (window.speechSynthesis) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = this.speakStepText;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.speechSynthesis.cancel();
    next();
  }
};
</script>

<style scoped>
.story-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: repeat-y;
  min-height: 100vh;
}

/* Top navigation bar with buttons and progress bar */
.top-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}

/* Progress bar styles */
.progress-container {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: visible;
}

.progress-fill {
  height: 100%;
  background-color: #4a90e2;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-dot.active {
  background-color: #4a90e2;
  border-color: white;
}

.progress-dot.current {
  transform: translate(-50%, -50%) scale(1.5);
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.7);
  background-color: #3c20da;
}

.progress-text {
  margin-top: 10px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.progress-dot:hover::after {
  content: attr(title);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-box {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 80%;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.popup-box h3 {
  margin-top: 0;
  color: #333;
}

.popup-box button {
  margin-top: 15px;
  padding: 8px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.popup-box button:hover {
  background-color: #357ab8;
}

.scene-wrapper {
  position: relative;
  height: 550px;
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

/* Centered instruction overlay */
.instruction-overlay {
  position: absolute;
  top: 51%;
  left: 50%;
  width: calc(100% - 60px);
  height: 530px;
  background-color: rgba(89, 88, 88, 0.5);
  z-index: 100;
  border-radius: 8px;
  transform: translate(-50%, -50%);
}

/* Close button styles */
.close-button {
  position: absolute;
  top: 20px;
  right: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 102;
}

.close-icon {
  background-color: #FF3A3A;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.close-label {
  background-color: #FF5A5A;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  margin-top: 8px;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
}

/* Callout styles */
.callout {
  position: absolute;
  z-index: 101;
}

.callout-text {
  background-color: #5a73ff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
}

.callout-line {
  width: 100px;
  height: 100px;
  position: absolute;
  overflow: visible;
}

/* Positioning for specific callouts */
.callout-dialog {
  right: 20%;
  bottom: 100px;
}

.callout-dialog .callout-line {
  top: 50%;
  right: 80%;
}

.callout-who {
  left: 5%;
  bottom: 60px;
}

.callout-who .callout-line {
  top: 50%;
  left: 20%;
}

.callout-click {
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}

.callout-click .callout-line {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

/* New callout for progress dots */
.callout-dots {
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
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

.back-btn {
  padding: 8px 14px;
  background-color: #ffa726;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.back-btn:hover {
  background-color: #fb8c00;
}

.mute-btn {
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