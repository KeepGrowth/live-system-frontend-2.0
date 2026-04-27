<template>
  <div class="cyber-chart-container">
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
    default: '赛博数据监控中心'
  },
  chartData: {
    type: Object,
    default: () => ({
      categories: [],
      series: []
    })
  }
})

// --- Refs ---
const chartRef = ref(null)
let myChart = shallowRef(null)

// --- 赛博朋克配色方案 ---
const CYBER_COLORS = [
  '#00f3ff',
  '#ff00ff', // 霓虹洋红
  '#fcee0a', // 霓虹黄
  '#7000ff', // 霓虹紫
  '#ff2a2a'  // 霓虹红
]

// --- 模拟数据生成器 (如果 props 没传数据时使用) ---
const generateMockData = () => {
  const categories = ['2077-01', '2077-02', '2077-03', '2077-04', '2077-05', '2077-06']
  const series = []
  return { categories, series }
}

// --- 初始化 ECharts ---
const initChart = () => {
  if (!chartRef.value) return

  // 1. 实例化
  myChart.value = echarts.init(chartRef.value)

  // 2. 获取数据
  const data = props.chartData.categories.length ? props.chartData : generateMockData()
  // const data = props.chartData

  // 3. 配置项
  const option = {
    backgroundColor: 'transparent', // 深黑背景
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        color: '#00f3ff',
        fontFamily: 'Orbitron, sans-serif', // 科技感字体
        fontSize: 24,
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
    legend: {
      top: '10%',
      textStyle: { color: '#fff' },
      itemStyle: {
        borderWidth: 0,
        shadowColor: '#00f3ff',
        shadowBlur: 5
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
      borderColor: '#1f2229',
      show: true
    },
    toolbox: {
      feature: {
        saveAsImage: { title: '保存图像', iconStyle: { borderColor: '#00f3ff' } },
        restore: { title: '重置', iconStyle: { borderColor: '#ff00ff' } },
        dataView: { title: '数据视图', readOnly: false, iconStyle: { borderColor: '#fcee0a' } },
        magicType: { type: ['bar'], iconStyle: { borderColor: '#7000ff' } }
      },
      right: 20,
      top: 20
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLine: { lineStyle: { color: '#00f3ff', width: 1 } },
      axisTick: { alignWithLabel: true, lineStyle: { color: '#00f3ff' } },
      axisLabel: { color: '#fff', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#1f2229',
          type: 'dashed'
        }
      },
      axisLabel: { color: '#fff' },
      axisLine: { show: false }
    },
    dataZoom: [
      {
        type: 'slider',       // 滑动条类型
        show: true,           // 显示
        xAxisIndex: [0],      // 控制 x 轴
        start: 0,             // 默认起始位置 0%
        end: 50,              // 默认结束位置 50% (数据多时可设为 20 或 30)
        height: 20,           // 滚动条高度
        bottom: 20,           // 距离底部的距离
        left: '5%',           // 宽度留白
        width: '90%',
        backgroundColor: 'rgba(31, 34, 41, 0.5)', // 背景色：与 grid 边框色呼应
        dataBackground: {     // 数据背景样式
          lineStyle: { color: '#00f3ff', width: 1 }, // 线条颜色
          areaStyle: { color: 'rgba(0, 243, 255, 0.3)' } // 填充颜色
        },
        selectedDataBackground: { // 选中部分的数据背景
          lineStyle: { color: '#00f3ff' },
          areaStyle: { color: 'rgba(0, 243, 255, 0.6)' }
        },
        handleStyle: {        // 拖拽手柄样式
          color: '#00f3ff',
          shadowBlur: 10,
          shadowColor: '#00f3ff'
        },
        textStyle: { color: 'transparent' } // 隐藏默认的数字文本，保持简洁
      },
      {
        type: 'inside',       // 内置型缩放（支持鼠标滚轮滚动缩放）
        xAxisIndex: [0],
        start: 0,
        end: 50
      }
    ],
    series: data.series.map(item => ({
      ...item,
      barWidth: '3%',
      itemStyle: {
        ...item.itemStyle,
        borderRadius: [4, 4, 0, 0], // 柱状图圆角
        shadowColor: item.itemStyle.color,
        shadowBlur: 15 // 发光效果
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 25,
          shadowOffsetX: 0,
          shadowColor: 'rgba(255, 255, 255, 0.5)'
        }
      }
    }))
  }

  // 4. 设置配置
  myChart.value.setOption(option)
}

// --- 监听 Props 变化 ---
watch(() => props.chartData, () => {
  console.log(props.chartData)
  if (myChart.value) {
    initChart()
  }
}, { deep: true })

watch(() => props.title, () => {
  if (myChart.value) {
    myChart.value.setOption({ title: { text: props.title } })
  }
})

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
  min-height: 500px;
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
  width: 20px;
  height: 20px;
  border-top: 3px solid #00f3ff;
  border-left: 3px solid #00f3ff;
}

.cyber-chart-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-bottom: 3px solid #ff00ff;
  border-right: 3px solid #ff00ff;
}

.chart-instance {
  width: 100%;
  height: 100%;
}
</style>
