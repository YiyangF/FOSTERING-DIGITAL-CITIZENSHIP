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
          <div class="left-header">
            <h3>Select an Emoji</h3>
            <p>Tap to learn its deeper meaning.</p>
          </div>
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
          <div class="right-card">
            <div class="big-emoji">{{ selectedEmoji.char }}</div>
            <div class="emoji-title">{{ selectedEmoji.name }}</div>
            <div class="emoji-description">{{ selectedEmoji.desc }}</div>
            <div class="emoji-example">
              <strong>Example:</strong> {{ selectedEmoji.example }}
            </div>
          </div>
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
    const res = await fetch('https://backend-database-production-a97a.up.railway.app/api/emoji-meanings')
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.tabs-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.tab {
  min-width: 100px;
  height: 50px;
  cursor: pointer;
  border: 2px solid #444;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  transition: 0.3s;
}

.tab.active {
  height: 60px;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.book-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  height: 600px;
}

.book-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: contain;
}

.left-page,
.right-page {
  width: 48%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

.left-header {
  margin-bottom: 16px;
  text-align: center;
  color: #444;
}

.emoji-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.emoji-item.selected {
  background-color: #fff6cc;
}

.emoji {
  font-size: 22px;
}

.emoji-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.right-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.big-emoji {
  font-size: 80px;
  margin-bottom: 16px;
}

.emoji-title {
  font-size: 22px;
  font-weight: bold;
  color: #4a3b2f;
  margin-bottom: 10px;
}

.emoji-description {
  font-size: 15px;
  color: #444;
  margin-bottom: 6px;
}

.emoji-example {
  font-size: 14px;
  color: #555;
  font-style: italic;
}
</style>
