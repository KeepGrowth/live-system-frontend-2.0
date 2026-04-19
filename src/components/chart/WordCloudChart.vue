<template>
  <div class="cyber-container">
    <div ref="chartRef" class="cyber-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';
// 引入词云插件
import 'echarts-wordcloud';

// --- Props 定义 ---
const props = defineProps({
  chartData: {
    type: Array,
    default: () => [
      { name: 'CYBER', value: 100 },
      { name: 'PUNK', value: 80 },
      { name: 'NEON', value: 60 },
      { name: 'FUTURE', value: 50 },
      { name: 'TECH', value: 45 },
      { name: 'SYSTEM', value: 40 },
      { name: 'DATA', value: 35 },
      { name: 'NET', value: 30 },
      { name: 'AI', value: 25 },
      { name: 'HACK', value: 20 },
      { name: 'BOT', value: 15 },
      { name: 'GRID', value: 10 },
    ]
  },
  titleText: {
    type: String,
    default: '词云图组件'
  }
});

const chartRef = ref(null);
let myChart = null;

// --- 赛博朋克配色方案 ---
const colors = ['#00f3ff', '#ff00ff', '#bc13fe', '#0ff0fc', '#7000ff'];

// --- ECharts 配置 ---
const getOption = () => {
  return {
    backgroundColor: 'transparent', // 极深的背景色
    title: {
      text: props.titleText,
      left: 'center',
      top: 20,
      textStyle: {
        color: '#00f3ff',
        fontFamily: 'Orbitron, sans-serif', // 科技感字体
        fontSize: 24,
        textShadowColor: '#00f3ff',
        textShadowBlur: 10,
        letterSpacing: 2
      }
    },
    tooltip: {
      show: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00f3ff',
      textStyle: {
        color: '#fff',
        fontFamily: 'Orbitron, sans-serif'
      },
      formatter: function (params) {
        return `<span style="color:#00f3ff">${params.name}</span>: ${params.value}`;
      }
    },
    // 图例配置
    legend: {
      show: true, // 显示图例
      bottom: 10,
      textStyle: {
        color: '#fff',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 12
      },
      // 图例选择器的按钮颜色
      pageIconColor: '#00f3ff',
      pageTextStyle: {
        color: '#00f3ff'
      }
    },
    series: [
      {
        type: 'wordCloud',
        // 形状：'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '70%',
        height: '80%',
        // 文字大小范围
        sizeRange: [12, 60],
        // 旋转范围
        rotationRange: [-45, 45],
        // 旋转步长
        rotationStep: 45,
        // 字体大小缩放
        sizeWeight: 'value',
        // 字体
        fontFamily: 'Orbitron, sans-serif',
        // 字体粗细
        fontWeight: 'bold',
        // 文本间距
        gridSize: 8,

        // 强调状态（鼠标悬停）
        emphasis: {
          focus: 'self',
          textStyle: {
            color: '#fff',
            textShadowBlur: 10,
            textShadowColor: '#ff00ff', // 悬停时的霓虹色
            fontWeight: 'bold'
          }
        },

        // 数据标签样式
        textStyle: {
          color: function () {
            return colors[Math.floor(Math.random() * colors.length)];
          },
          // 文本阴影，营造发光效果
          textShadowBlur: 4,
          textShadowColor: '#00f3ff'
        },

        // 数据
        data: props.chartData
      }
    ]
  };
};

// --- 初始化与更新逻辑 ---
const initChart = () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);
    myChart.setOption(getOption());
  }
};

const resizeChart = () => {
  myChart && myChart.resize();
};

// 监听数据变化
watch(() => props.chartData, (newData) => {
  if (myChart) {
    myChart.setOption({
      series: [{ data: newData }]
    });
  }
}, { deep: true });

watch(() => props.titleText, () => {
  if(myChart) {
    myChart.setOption({
      title: { text: props.titleText }
    });
  }
})

onMounted(() => {
  // 动态加载字体
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  initChart();
  window.addEventListener('resize', resizeChart);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});
</script>

<style scoped>
.cyber-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: 1px solid #333;
  /* 赛博朋克边框效果 */
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* 可选：添加扫描线背景纹理 */
.cyber-container::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background-size: 100% 2px, 3px 100%;
  pointer-events: none; /* 让鼠标事件穿透纹理 */
}

.cyber-chart {
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
