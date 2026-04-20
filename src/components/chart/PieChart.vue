<template>
  <div class="cyber-pie-container">
    <!-- 装饰性边角 -->
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>

    <div ref="chartRef" class="chart-instance"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

// --- 赛博朋克动态配色盘 ---
// 这是一组高对比度的霓虹色，模拟全息投影效果
const CYBERPUNK_COLORS = [
  '#ff0055', // 荧光粉红 (主色)
  '#00f3ff', // 霓虹青蓝 (副色)
  '#fcee0a', // 电光黄 (高亮)
  '#bd00ff', // 紫外光 (深色背景下的亮色)
  '#00ff88', // 荧光绿 (科技感)
  '#ff5500'  // 熔岩橙 (警告色)
];

const chartRef = ref(null);
let chartInstance = null;

const props = defineProps({
  title: {
    type: String,
    default: 'Cyberpunk Data'
  },
  // 接受外部数据，格式: [{ name: 'Category A', value: 40 }]
  data: {
    type: Array,
    default: () => [
      { name: 'Neon City', value: 33.3 },
      { name: 'Data Stream', value: 33.3 },
      { name: 'AI Core', value: 33.3 }
    ]
  }
});

// --- ECharts 配置项 ---
const getOption = () => {
  return {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        color: '#00f3ff', // 霓虹青蓝标题
        fontFamily: '"Orbitron", monospace',
        fontSize: 20,
        textShadow: '0 0 10px #00f3ff' // 发光效果
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 19, 31, 0.9)',
      borderColor: '#ff0055',
      textStyle: {
        color: '#ffffff',
        fontFamily: 'monospace'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)' // 显示百分比
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        color: '#a0a0a0',
        fontFamily: 'monospace'
      },
      // 图例项的图形样式
      itemGap: 20,
      itemWidth: 12,
      itemHeight: 12
    },
    // 核心：定义多变的赛博朋克颜色
    color: CYBERPUNK_COLORS,
    series: [
      {
        name: 'Cyber Data',
        type: 'pie',
        radius: ['40%', '60%'], // 空心圆环
        center: ['60%', '55%'], // 偏移中心以留出图例空间
        // 强烈的阴影和描边效果
        itemStyle: {
          borderColor: '#000',
          borderWidth: 2,
          // 鼠标悬停时的高亮效果
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 243, 255, 0.5)'
          }
        },
        label: {
          show: true,
          // 标签文字使用科技字体
          fontFamily: '"Orbitron", monospace',
          color: '#ffffff',
          // 标签线的样式
          lineStyle: {
            color: 'auto'
          }
        },
        // 引导线配置
        labelLine: {
          length: 15, // 第一段长度
          length2: 10, // 第二段长度
          smooth: true // 平滑曲线
        },
        data: props.data
      }
    ]
  };
};

// --- 生命周期 ---
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(getOption());
  }
};

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

// 监听数据变化
watch(() => props.data, () => {
  chartInstance?.setOption(getOption());
}, { deep: true });

</script>

<style scoped>
/* 引入 Orbitron 字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.cyber-pie-container {
  position: relative;
  width: 100%;
  height: 500px; /* 默认高度 */
  /* 深色背景配合霓虹色 */
  border: 1px solid rgba(0, 243, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
  backdrop-filter: blur(4px);
}

.chart-instance {
  width: 100%;
  height: 100%;
}

/* 装饰边角样式 */
.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid;
  border-image: linear-gradient(45deg, #ff0055, #00f3ff) 1;
  transition: all 0.3s ease;
  z-index: 10;
}

.corner:hover {
  border-color: #fcee0a;
  transform: scale(1.2);
}

.top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
.top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
.bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
.bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }
</style>
