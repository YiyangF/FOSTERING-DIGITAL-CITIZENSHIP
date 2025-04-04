<template>
  <div class="container">
    <!-- 左侧：描述内容 -->
    <div class="text-section">
      <h2>用户访问趋势</h2>
      <p>右侧展示的是一个动态更新的折线图，模拟访问量的变化。</p>
      <p>每2秒自动刷新一次数据，展示趋势变化。</p>
    </div>

    <!-- 右侧：动态折线图 -->
    <div class="chart-section" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null
let timer = null

// 模拟数据
let xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
let yData = [120, 200, 150, 80, 70, 110, 130]

function updateChart() {
  // 随机波动数据
  yData = yData.map(v => v + Math.floor(Math.random() * 40 - 20))
  const option = {
    title: {
      text: '一周访问量',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        data: yData,
        smooth: true,
        showSymbol: false,
        animationDuration: 1000
      }
    ]
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  // 每2秒更新一次图表数据
  timer = setInterval(updateChart, 2000)
  window.addEventListener('resize', () => chartInstance.resize())
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.text-section {
  flex: 1;
  min-width: 300px;
}

.chart-section {
  flex: 1;
  min-width: 300px;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>
