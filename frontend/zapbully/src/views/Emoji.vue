<template>
  <div class="emoji-app">
    <h1 class="title">Emoji Dictionary</h1>
    <p class="instruction">Another way to understand emojis that parents should know.</p>

    <div class="dictionary-container">
      <div class="tabs-container">
        <div
          v-for="(tab, index) in tabCategories"
          :key="index"
          class="tab"
          :class="{ active: index === activeTab }"
          :style="{ backgroundColor: tab.color }"
          @click="selectTab(index)"
        >
          <span class="tab-text">{{ tab.name }}</span>
        </div>
      </div>

      <div class="book-container">
        <img class="book-image" :src="book" alt="Book frame" />

        <div class="left-page">
          <div
            v-for="(emoji, idx) in groupedEmojis[activeTab]"
            :key="idx"
            class="emoji-item"
            :class="{ selected: idx === selectedEmojiIndex }"
            @click="selectedEmojiIndex = idx"
          >
            <div class="emoji">{{ emoji.char }}</div>
            <div class="emoji-name">{{ emoji.name }}</div>
          </div>
        </div>

        <div class="right-page">
          <div class="big-emoji">{{ selectedEmoji.char }}</div>
          <div class="emoji-title">{{ selectedEmoji.name }}</div>
          <div class="emoji-description">{{ selectedEmoji.desc }}</div>
          <div class="emoji-example"><strong>Example:</strong> {{ selectedEmoji.example }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import book from '@/assets/book.png'

const tabCategories = ref([])
const groupedEmojis = ref([])
const activeTab = ref(0)
const selectedEmojiIndex = ref(0)

const selectedEmoji = computed(() => {
  const group = groupedEmojis.value[activeTab.value] || []
  return group[selectedEmojiIndex.value] || {}
})

const selectTab = (index) => {
  activeTab.value = index
  selectedEmojiIndex.value = 0
}

onMounted(async () => {
  try {
    const res = await fetch('http://backend-database-production-a97a.up.railway.app/api/emoji-meanings')
    const data = await res.json()

    const categories = [...new Set(data.map(item => item.category))]

    tabCategories.value = categories.map((cat, idx) => ({
      raw: cat,
      name: cat.split(/[\s/]+/)[0], 
      color: ['#e6adf6', '#f68fab', '#73f1d7', '#ffe88b', '#fac988', '#d4f58b', '#a1e3ff'][idx % 7]
    }))

    groupedEmojis.value = categories.map(cat =>
      data
        .filter(e => e.category === cat)
        .map(e => ({
          char: e.emoji,
          name: e.actual_meaning,
          desc: e.hidden_meaning,
          example: e.example
        }))
    )
  } catch (err) {
    console.error('Failed to load emoji meanings:', err)
  }
})
</script>

<style scoped>
@import url('https://unpkg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css');


.emoji-app {
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  background: url('@/assets/background_image.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
}


.emoji-app .book-container,
.emoji-app .left-page,
.emoji-app .right-page {
  background-color: transparent !important;
}

.title {
  font-size: 36px;
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
  width: 1100px;
  margin: 0 auto;
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
}

.tab-text {
  font-weight: bold;
  color: #333;
}

.tab.active {
  height: 90px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.book-container {
  position: relative;
  width: 1100px;
  height: 700px;
  z-index: 1;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.left-page,
.right-page {
  position: absolute;
  top: 100px;
  width: 42%;
  height: 70%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.left-page {
  left: 80px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.emoji-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.emoji-item.selected {
  background-color: #fff6cc;
}

.emoji {
  font-size: 24px;
}

.emoji-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.right-page {
  right: 84px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.big-emoji {
  font-size: 100px;
  margin-bottom: 20px;
}

.emoji-title {
  font-size: 24px;
  font-weight: bold;
  color: #4a3b2f;
  margin-bottom: 10px;
}

.emoji-description {
  font-size: 16px;
  color: #444;
  margin-bottom: 8px;
}

.emoji-example {
  font-size: 15px;
  color: #555;
  font-style: italic;
}
</style>
