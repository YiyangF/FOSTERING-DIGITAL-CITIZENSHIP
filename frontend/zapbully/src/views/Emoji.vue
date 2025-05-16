<template>
  <div class="page-container">
    <h1 class="title">Emoji Dictionary</h1>
    <p class="instruction">Another way to understand emojis that parents should know.</p>

    <div class="dictionary-container">
      <!-- Tabs -->
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

      <!-- Book-style layout -->
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
    const res = await fetch('http://localhost:3001/api/emoji-meanings') // 请根据部署情况修改 URL
    const data = await res.json()

    const categories = [...new Set(data.map(item => item.category))]

    tabCategories.value = categories.map((cat, idx) => ({
      name: cat,
      color: ['#e6adf6', '#f68fab', '#73f1d7', '#ffe88b', '#fac988', '#d4f58b', '#a1e3ff'][idx % 7]
    }))

    groupedEmojis.value = categories.map(cat =>
      data
        .filter(e => e.category === cat)
        .map(e => ({
          char: e.emoji,
          name: e.actual_meaning,
          desc: e.hidden_meaning
        }))
    )
  } catch (err) {
    console.error('Failed to load emoji meanings:', err)
  }
})
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
  grid-template-columns: repeat(3, 1fr);
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
