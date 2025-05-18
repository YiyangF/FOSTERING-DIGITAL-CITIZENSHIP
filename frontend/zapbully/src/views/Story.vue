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

    <div v-if="showPopup" class="popup-overlay" @click.stop>
      <div class="popup-box">
        <h3>{{ popupData?.title || 'Notice' }}</h3>
        <p>{{ popupData?.message || '' }}</p>
        <button @click.stop="closePopup">{{ popupData?.buttonText || 'OK' }}</button>
      </div>
    </div>

    <div v-if="showInstructions" class="instruction-overlay">
      <!-- Close button -->
      <div class="close-button" @click.stop="closeInstructions">
        <div class="close-icon">✕</div>
        <div class="close-label">Close to Start!</div>
      </div>
      
      <!-- Instructions content -->
      <div class="instructions-content">
        <h2>How to Play</h2>
        
        <div class="instruction-item">
          <p><strong>Dialog box:</strong> Shows the conversation text</p>
        </div>
        
        <div class="instruction-item">
          <p><strong>Who is saying:</strong> The name before ':' indicates which character is speaking</p>
        </div>
        
        <div class="instruction-item">
          <p><strong>Navigation:</strong> Click anywhere on the screen to continue the story</p>
        </div>
        
        <div class="instruction-item">
          <p><strong>Progress bar:</strong> Above is the progress bar. Each dot represents a key ending that you can jump to after viewing</p>
        </div>

        <div class="instruction-item">
          <p><strong>Mute voice:</strong> The mute button is at the top right</p>
        </div>

        <div class="instruction-item">
          <p><strong>Back:</strong> The back button is at the top left for return to story selection</p>
        </div>
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
      // Prevent any potential click handlers from firing
      event.stopPropagation();
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
            customTooltip: step.stepText || null
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
      
      // Disable clicks during any transition
      this.clickEnabled = false;
      this.transitionInProgress = true;
      this.previousStepIndex = this.currentStepIndex;

      const currentStep = this.step;
      const nextStep = this.story.steps[index];

      // Make sure to cancel any speech and animations when changing steps
      window.speechSynthesis.cancel();
      
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
        
        // Only enable clicks after the step has fully loaded
        // If it's a chat step, clicking will be managed by startChat
        if (!nextStep.chat) {
          this.clickEnabled = true;
        }
      };

      if (nextStep && nextStep.preserveBackground && currentStep && currentStep.background === nextStep.background) {
        updateStep();
      } else {
        setTimeout(updateStep, 300);
      }
    },
    handleClick(event) {
      // Don't advance if popup is showing, instructions are showing,
      // clicks are disabled, or a transition is in progress
      if (this.showPopup || 
          this.showInstructions || 
          !this.clickEnabled || 
          this.transitionInProgress) {
        return;
      }
      
      // Check if we're in a chat scene and if we're done with the messages
      if (this.showPhone) {
        // If we're in a chat scene, only proceed if all messages have been shown
        if (this.readyForNext && this.step.next !== undefined) {
          this.goToStep(this.step.next);
        }
        return;
      }

      // Only advance the scene if there are no choices and next is defined
      if (!this.step.choices && this.step.next !== undefined) {
        this.goToStep(this.step.next);
      }
    },
    startChat() {
      // Store reference to messageTimer so we can clear it later if needed
      this.clickEnabled = false;
      this.hideTextBox = true;
      
      setTimeout(() => {
        this.showPhone = true;
        this.typing = true;

        const totalMessages = this.step.messages?.length || 0;
        if (totalMessages === 0) {
          this.typing = false;
          this.clickEnabled = true; // Re-enable clicks if no messages
          return;
        }

        const totalDuration = 5000;
        const interval = totalMessages > 0 ? totalDuration / totalMessages : totalDuration;

        // Store the timer reference so we can clear it when needed
        this.messageTimer = setInterval(() => {
          if (this.currentMessageIndex >= totalMessages) {
            clearInterval(this.messageTimer);
            this.messageTimer = null;
            this.typing = false;
            this.readyForNext = true;
            
            // Only re-enable clicks when all messages have been displayed
            setTimeout(() => {
              this.clickEnabled = true;
            }, 500); // Small buffer to ensure animation is fully complete
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
      // Cancel any ongoing animations
      if (this.messageTimer) {
        clearInterval(this.messageTimer);
        this.messageTimer = null;
      }
      
      this.showPhone = false;
      this.visibleMessages = [];
      this.currentMessageIndex = 0;
      this.typing = false;
      this.readyForNext = false;
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

      const utterance = new SpeechSynthesisUtterance(this.step.text);
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

.instruction-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80%;
  max-width: 600px;
  background-color: white;
  z-index: 100;
  border-radius: 12px;
  transform: translate(-50%, -50%);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 25px;
  text-align: left;
}

/* Close button styles */
.close-button {
  position: absolute;
  top: 15px;
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.close-label {
  background-color: #FF5A5A;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  margin-top: 6px;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
}

/* Instructions content */
.instructions-content {
  margin-top: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.instruction-item {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.instruction-item p {
  margin: 0;
  line-height: 1.5;
}

.instruction-item strong {
  color: #5a73ff;
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

.message-bubble { background-color: #eaeced; }

.sender {
  font-weight: bold;
}

.text {
  margin-top: 4px;
}
</style>