<template>
  <div class="cyber-chart-container">
    <!-- 图表挂载点 -->
    <div ref="chartRef" class="chart-instance"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import * as echarts from 'echarts'

// --- Props 定义 ---
const props = defineProps({
  title: {
    type: String,
    default: '系统资源监控'
  },
  chartData: {
    type: Array, // 这里改为接收数组，格式为 [{name: 'CPU', value: 80}, ...]
    default: () => [
      { name: 'CPU 核心组 A', value: 85 },
      { name: '内存占用', value: 62 },
      { name: '网络下行', value: 48 },
      { name: '网络上行', value: 30 },
      { name: '磁盘读写', value: 90 },
      { name: 'GPU 负载', value: 75 }
    ]
  }
})

// --- Refs ---
const chartRef = ref(null)
let myChart = shallowRef(null)

// --- 初始化 ECharts ---
const initChart = () => {
  if (!chartRef.value) return

  // 1. 实例化
  if (myChart.value) myChart.value.dispose() // 防止重复初始化
  myChart.value = echarts.init(chartRef.value)

  // 2. 确定数据源
  const data = props?.chartData

  // 3. 配置项
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        color: '#00f3ff',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 20,
        textShadowColor: '#00f3ff',
        textShadowBlur: 10
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(11, 12, 16, 0.9)',
      borderColor: '#00f3ff',
      textStyle: { color: '#fff' }
    },
    toolbox: {
      show: true, // 显示工具箱
      right: '5%', // 工具箱位置
      feature: {
        magicType: { // 动态类型切换
          show: true,
          title: {
            line: '切换为折线图',
            bar: '切换为柱状图',
            tiled: '切换为平铺'
          },
          type: ['bar', 'tiled'] // 允许切换的类型
        },
        restore: { // 还原
          show: true,
          title: '还原'
        },

      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: '#1f2229',
          type: 'dashed'
        }
      },
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'category',
      data: data?.map(item => item.name),
      inverse: true, // 倒序排列，让第一个数据显示在最上面
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#00f3ff',
        fontSize: 12,
        margin: 20
      }
    },
    series: [
      {
        name: '数值',
        type: 'bar',
        data: (data || []).map(item => (item.value / 60).toFixed(2)),
        barWidth: '40%', // 柱子宽度
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#00f3ff' },
            { offset: 1, color: '#7000ff' }
          ]),
          borderRadius: [0, 10, 10, 0], // 右侧圆角
          shadowColor: '#00f3ff',
          shadowBlur: 10
        },
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          formatter: '{c} '
        },
        // 鼠标悬停高亮
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }
    ]
  }

  // 4. 设置配置
  myChart.value.setOption(option)
}

// --- 监听 Props 变化 ---
watch(() => props.chartData, () => {
  if (myChart.value) {
    initChart()
  }
}, { deep: true })

// --- 生命周期与事件 ---
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (myChart.value) {
    myChart.value.dispose()
    myChart.value = null
  }
})

const handleResize = () => {
  myChart.value && myChart.value.resize()
}
</script>

<style scoped>
.cyber-chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 1px solid #1f2229;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* 装饰性边角 - 赛博朋克风格 */
.cyber-chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  border-top: 3px solid #00f3ff;
  border-left: 3px solid #00f3ff;
  z-index: 10;
}

.cyber-chart-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-bottom: 3px solid #ff00ff;
  border-right: 3px solid #ff00ff;
  z-index: 10;
}

.chart-instance {
  width: 100%;
  height: 100%;
}
</style>
