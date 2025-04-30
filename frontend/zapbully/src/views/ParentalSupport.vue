<template>
  <div class="container">
    <h1>网络暴力事件报告生成器</h1>
    <textarea v-model="description" placeholder="请描述事件，例如：我孩子在TikTok上被辱骂…"></textarea>
    <select v-model="audience">
      <option value="school">学校</option>
      <option value="police">警方</option>
      <option value="socialMedia">社交平台</option>
    </select>
    <button @click="generate">生成报告</button>

    <div v-if="loading">生成中...</div>
    <div v-if="report" id="reportBox">
      <h2>生成的报告</h2>
      <pre>{{ report }}</pre>
      <button @click="download">导出 PDF</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
// import html2pdf from 'html2pdf.js'

const description = ref('')
const audience = ref('school')
const report = ref('')
const loading = ref(false)

const generate = async () => {
  loading.value = true
  const res = await axios.post(import.meta.env.VITE_API_URL + '/generate', {
    description: description.value,
    audience: audience.value
  })
  report.value = res.data.report
  loading.value = false
}

// const download = async () => {
//   const element = document.getElementById('reportBox')

//   const module = await import('html2pdf.js') // ⬅️ 动态引入
//   const html2pdf = module.default || module  // 有些版本挂在 default 上

//   html2pdf().from(element).save('网络暴力报告.pdf')
// }

</script>

<style scoped>
textarea { width: 100%; height: 100px; margin-bottom: 10px; }
.container { padding: 20px; max-width: 600px; margin: auto; }
</style>
