<template>
  <div ref="chartRef" class="cyber-chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import * as echarts from 'echarts';

// --- Props 定义 ---
const props = defineProps({
  title: {
    type: String,
    default: '条形图组件'
  },
  xAxisData: {
    type: Array,
    default: () => ['节点A', '节点B', '节点C', '节点D', '节点E']
  },
  seriesData: {
    type: Array,
    // 默认的多柱状图数据
    default: () => [
      { name: '网络负载', data: [820, 932, 901, 934, 1290] },
      { name: '能源消耗', data: [120, 232, 201, 134, 290] },
      { name: '威胁指数', data: [45, 80, 30, 120, 60] }
    ]
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  }
});

// --- 赛博朋克配色方案 ---
const CYBER_COLORS = ['#00f3ff', '#ff00ff', '#ffe600']; // 青色, 洋红, 黄色
const BG_COLOR = '#0b0c15'; // 深空灰/黑

const chartRef = ref(null);
let myChart = shallowRef(null);

// --- 初始化图表 ---
const initChart = () => {
  if (!chartRef.value) return;

  myChart.value = echarts.init(chartRef.value);

  // 构建 series 配置，应用赛博风格
  const seriesConfig = props.seriesData.map((item, index) => {
    const color = CYBER_COLORS[index % CYBER_COLORS.length];
    return {
      name: item.name,
      type: 'bar',
      barWidth: '30%',
      data: item.data,
      // 柱子样式：核心视觉部分
      itemStyle: {
        color: 'transparent', // 柱子内部透明，制造中空感
        borderColor: color,   // 边框颜色使用霓虹色
        borderWidth: 2,       // 边框宽度
        borderType: 'solid',
        // 发光阴影效果
        shadowColor: color,
        shadowBlur: 15
      },
      // 鼠标悬停时的高亮样式
      emphasis: {
        itemStyle: {
          color: color, // 悬停时填充颜色
          opacity: 0.3,
          shadowBlur: 25,
          shadowColor: color
        }
      }
    };
  });

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontFamily: 'Orbitron, sans-serif', // 建议引入科技感字体
        fontSize: 18,
        letterSpacing: 2
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(11, 12, 21, 0.9)',
      borderColor: '#00f3ff',
      textStyle: { color: '#00f3ff' }
    },
    legend: {
      top: 'bottom',
      textStyle: {
        color: '#fff'
      },
      // 图例图标样式
      icon: 'rect',
      itemWidth: 15,
      itemHeight: 8
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData,
      axisLine: {
        lineStyle: { color: '#333' } // 轴线颜色
      },
      axisLabel: {
        color: '#888',
        margin: 20
      },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#222',
          type: 'dashed' // 虚线网格，更有科技感
        }
      },
      axisLabel: {
        color: '#888'
      }
    },
    series: seriesConfig
  };

  myChart.value.setOption(option);
};

// --- 监听数据变化 ---
watch(() => [props.xAxisData, props.seriesData, props.title], () => {
  initChart();
}, { deep: true });

// --- 生命周期与响应式 ---
onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (myChart.value) {
    myChart.value.dispose();
  }
});

const handleResize = () => {
  myChart.value?.resize();
};
</script>

<style scoped>
.cyber-chart-container {
  width: v-bind(width);
  height: v-bind(height);
  border: 1px solid #222; /* 容器微边框 */
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1); /* 整体外发光 */
  border-radius: 4px;
}
</style>
