<template>
  <div class="page-container">
    <h1 class="title">Emoji Dictionary</h1>
    <p class="instruction">Another way to understand emojis that parents should know.</p>
    
    <div class="dictionary-container">
      <!-- Tabs positioned outside the book -->
      <div class="tabs-container">
        <div
          v-for="(tab, index) in tabCategories"
          :key="index"
          class="tab"
          :class="{ active: index === activeTab }"
          :style="{ backgroundColor: tab.color }"
          @click="activeTab = index"
        >
          <span class="tab-text">{{ tab.name }}</span>
        </div>
      </div>
      
      <!-- Book with content -->
      <div class="book-container">
        <img class="book-image" :src="book" alt="Book frame" />
        
        <!-- Left and right page content -->
        <div class="left-page">
          <div
            v-for="(emoji, idx) in groupedEmojis[activeTab]"
            :key="idx"
            class="emoji-item"
            :class="{ selected: idx === selectedEmojiIndex }"
            @click="selectedEmojiIndex = idx"
          >
            {{ emoji.char }}
          </div>
        </div>
        
        <div class="right-page">
          <div class="big-emoji">{{ selectedEmoji.char }}</div>
          <div class="emoji-title">{{ selectedEmoji.name }}</div>
          <div class="emoji-description">{{ selectedEmoji.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import book from '@/assets/book.png'

const tabCategories = [
  { name: 'Sexual', color: '#e6adf6' },
  { name: 'Flirting', color: '#f68fab' },
  { name: 'Feelings', color: '#73f1d7' },
  { name: 'Symbolic', color: '#ffe88b' },
  { name: 'Misconception', color: '#fac988' }
]

const groupedEmojis = [
  [
    { char: '🍆', name: 'Eggplant', desc: 'Penis' },
    { char: '🍑', name: 'Peach', desc: 'Butt' },
    { char: '🌮', name: 'Taco', desc: 'Vagina' },
    { char: '👅', name: 'Tongue', desc: 'May indicate sexual activity, especially oral sex' },
    { char: '💦', name: 'Water', desc: 'Ejaculation' }
  ],
  [
    { char: '🥵', name: 'Sweating Face', desc: 'Means "hot" in a sexual sense; a kid might comment this on their crush\'s Instagram selfie, for example' },
    { char: '🤤', name: 'Drooling Face', desc: 'Desiring someone sexually (often used in response to nudes)' },
    { char: '😈', name: 'Demon', desc: 'Feeling frisky or naughty' },
    { char: '👀', name: 'Eyes', desc: 'Used when sending or receiving nudes' },
    { char: '⏳', name: 'Hourglass', desc: 'Used when someone has an “hourglass” body shape' }
  ],
  [
    { char: '🤡', name: 'Clown', desc: 'Used when getting caught in a mistake or when feeling like a fraud' },
    { char: '👻', name: 'Ghost', desc: 'Indicates being “ghosted” (dumped with no explanation)' },
    { char: '🧢', name: 'Hat', desc: 'Symbolizes a lie, which could also be called a “cap”' },
    { char: '🥶', name: 'Cold Face', desc: 'Often used in response to a snarky or "savage" comment (as in, "That was cold")' },
    { char: '🙃', name: 'Up-side-down Face', desc: 'Used to express annoyance about something' }
  ],
  [
    { char: '🚛', name: 'Dump Truck', desc: '“Dump truck,” which refers to a large and/or shapely bottom' },
    { char: '🧿', name: 'Evil Eye', desc: 'Represents warding off the "evil eye"' },
    { char: '💳', name: 'Credit Card', desc: 'Often used on TikTok to express wanting something portrayed in the video' },
    { char: '💯', name: '100 Marks', desc: 'A stamp of approval; “I agree”' },
    { char: '🍃', name: 'Leaf', desc: 'Emoji slang for Marijuana/weed' }
  ],
  [
    { char: '🐸', name: 'Frog', desc: 'Often used with "☕" (tea) to mean “that’s none of my business” or to spill gossip — made famous by the "Kermit sipping tea" meme' },
    { char: '💀', name: 'Skull', desc: '"I’m dead" — used to indicate something is extremely funny (as in “I laughed so hard I died”)' },
    { char: '🫶', name: 'Heart Hands', desc: 'Often used sarcastically to mean fake affection or to make fun of someone being overly sweet or performative' },
    { char: '😭', name: 'Loud Crying', desc: 'Extreme laughter, excitement, or exaggeration (not sadness). Teens now use this instead of 😂' },
    { char: '🙈', name: 'Monkey Covering Eyes', desc: 'Flirty or teasing reaction to something suggestive or naughty — like saying “I can’t look 😳” in a cute or ironic way' }
  ]
]

const activeTab = ref(0)
const selectedEmojiIndex = ref(0)

const selectedEmoji = computed(() => groupedEmojis[activeTab.value][selectedEmojiIndex.value])
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}

.title {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.instruction {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
  text-align: center;
}

.dictionary-container {
  position: relative;
  width: 900px;
}

.tabs-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: flex-end;
  height: 90px;
  margin-bottom: -17px;
}

.tab {
  width: 120px;
  height: 60px;
  cursor: pointer;
  border: 2px solid #444;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  transition: height 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.tab-text {
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.7);
}

.tab.active {
  height: 90px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.book-container {
  position: relative;
  width: 900px;
  height: 600px;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.left-page,
.right-page {
  position: absolute;
  top: 100px;
  width: 40%;
  height: 70%;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.left-page {
  left: 80px;
  background: rgba(255, 255, 255, 0.107);
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns */
  gap: 10px;
  align-content: start;
  padding: 20px;
  overflow-y: auto;
}

.right-page {
  right: 84px;
  background: rgba(255, 255, 255, 0.237);
  align-items: center;
  justify-content: center;
  text-align: center;
}

.emoji-item {
  font-size: 28px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
}

.emoji-item.selected {
  background-color: #fff6cc;
  border-radius: 10px;
  padding: 5px;
  transform: scale(1.1);
}

.big-emoji {
  font-size: 100px;
  margin-bottom: 20px;
}

.emoji-title {
  font-size: 24px;
  font-weight: bold;
  color: #4a3b2f;
}

.emoji-description {
  font-size: 16px;
  color: #444;
}
</style>