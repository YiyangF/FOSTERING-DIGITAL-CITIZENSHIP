<template>
    <div class="game-container">
        <div class="score-board" style="font-weight: bold; font-size: 18px; margin-bottom: 10px;">
            🧠 Score: {{ score }}
        </div>
        <video 
            ref="videoPlayer"
            :key="videoSrc"
            :src="videoSrc"
            controls
            @ended="onVideoEnd"
            class="video-player"
        />
        <div v-if="gameEnded" class="summary-section">
            <h3>Your Performance</h3>
            <p>You chose: {{ playerChoices.join(' → ') }}.</p>
            <p>Well done! some educational stuff</p>
            <button @click="restartGame">Play Again</button>
        </div>
  
      <button v-if="!gameStarted" @click="startGame">Start</button>
      
      <div v-if="showQuestion" class="question-section">
        <p>{{ levels[currentLevel].question }}</p>
        <button 
            v-for="(option, index) in levels[currentLevel].options" 
            :key="index"
            @click="chooseOption(option)"
            >
            {{ option.text }}
        </button>

        <button @click="replayVideo">Replay</button>
      </div>
    </div>
  </template>
  
<script>
import { ref, nextTick } from 'vue';
import testVideo_1 from '@/assets/internet_1.mp4';
import testVideo_A from '@/assets/internet_A.mp4';

export default {
  setup() {
    const videoPlayer = ref(null);
    const gameStarted = ref(false);
    const currentLevel = ref(0);
    const showQuestion = ref(false);
    const playerChoices = ref([]);
    const gameEnded = ref(false);
    const score = ref(10);
    
    const levels = [
      { 
        video: testVideo_1,
        question: "What will you do?",
        options: [
          { text: "Choice 1", nextVideo: testVideo_A, nextLevel: 1, score: +1 },
          { text: "Choice 2", nextVideo: testVideo_1, nextLevel: 1, score: +2 },
          { text: "Choice 3", nextVideo: testVideo_1, nextLevel: 1, score: +3 }
        ]
      },
      { 
        question: "Next decision?",
        options: [
          { text: "Option A", nextVideo: testVideo_1, nextLevel: 2, score: -1 },
          { text: "Option B", nextVideo: testVideo_1, nextLevel: 2, score: -2 },
          { text: "Option C", nextVideo: testVideo_1, nextLevel: 2, score: -3 }
        ]
      },
      {
        question: "Final decision?",
        options: [
          { text: "End A", nextVideo: testVideo_1, nextLevel: 3, score: +0 },
          { text: "End B", nextVideo: testVideo_1, nextLevel: 3, score: +1 },
          { text: "End C", nextVideo: testVideo_A, nextLevel: 3, score: -1 }
        ]
      }
    ];

    const videoSrc = ref(levels[0].video);

    function startGame() {
      gameStarted.value = true;
      videoSrc.value = levels[0].video;
      videoPlayer.value.play();
    }

    function onVideoEnd() {
    if (currentLevel.value >= 3) {
        gameEnded.value = true;
    } else {
        showQuestion.value = true;
    }
    }

    function chooseOption(option) {
        playerChoices.value.push(option.text);
        score.value += option.score;
        videoSrc.value = option.nextVideo;
        currentLevel.value = option.nextLevel;
        showQuestion.value = false;

        nextTick(() => {
            videoPlayer.value.load();
            videoPlayer.value.play().catch((err) => {
            console.error("Video failed to play:", err);
            });
        });
    }

    function replayVideo() {
      videoPlayer.value.currentTime = 0;
      videoPlayer.value.play();
    }

    function restartGame() {
        currentLevel.value = 0;
        playerChoices.value = [];
        gameEnded.value = false;
        videoSrc.value = levels[0].video;
        videoPlayer.value.load();
        videoPlayer.value.play();
    }


    return { 
      videoPlayer, gameStarted, currentLevel, showQuestion, levels, videoSrc,
      startGame, onVideoEnd, chooseOption, replayVideo,
      playerChoices, gameEnded, restartGame, score
    };
  }
};
</script>
  
  <style>
  .game-container { text-align: center; padding: 20px; }
  .video-player { width: 80%; max-width: 600px; display: block; margin: auto; }
  .question-section { margin-top: 20px; }
  button { margin: 5px; padding: 10px 20px; }
  </style>
  