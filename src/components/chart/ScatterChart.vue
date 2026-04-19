<template>
  <div ref="chartRef" class="cyberpunk-chart"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';

// --- 赛博朋克配色方案 ---
const THEME_COLORS = {
  cyan: '#00f3ff', // 霓虹青
  magenta: '#ff00ff', // 霓虹紫红
  yellow: '#fcee0a', // 赛博黄
  grid: '#1a1a1a', // 网格线颜色
  text: '#e0e0e0'  // 主文字颜色
};

// --- 默认 Props 数据 ---
const props = defineProps({
  chartData: {
    type: Array,
    default: () => [
      { name: 'Sector A', data: [[10, 12], [23, 25], [45, 30], [60, 55], [80, 40]] },
      { name: 'Sector B', data: [[15, 20], [30, 45], [50, 60], [70, 35], [90, 80]] },
      { name: 'Sector C', data: [[5, 50], [20, 65], [40, 45], [65, 75], [85, 90]] }
    ]
  },
  title: {
    type: String,
    default: '散点图组件'
  }
});

const chartRef = ref(null);
let chartInstance = null;

// --- 初始化图表 ---
const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        color: THEME_COLORS.cyan,
        fontFamily: 'monospace', // 等宽字体增加科技感
        fontSize: 18,
        letterSpacing: 2,
        textShadowColor: THEME_COLORS.cyan,
        textShadowBlur: 10
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: THEME_COLORS.cyan,
      textStyle: { color: THEME_COLORS.text },
      formatter: (params) => {
        return `<span style="color:${THEME_COLORS.cyan}"></span> ${params.seriesName}<br/>
                <span style="color:${THEME_COLORS.yellow}">坐标:</span> [${params.data[0]}, ${params.data[1]}]`;
      }
    },
    legend: {
      top: 50,
      textStyle: {
        color: THEME_COLORS.text,
        fontFamily: 'monospace'
      },
      // 自定义图例图标样式
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 243, 255, 0.5)'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true,
      borderColor: THEME_COLORS.grid
    },
    xAxis: {
      min: 0,
      max: 100,
      splitLine: {
        show: true,
        lineStyle: {
          color: THEME_COLORS.grid,
          type: 'dashed'
        }
      },
      axisLine: {
        lineStyle: { color: THEME_COLORS.cyan }
      },
      axisLabel: {
        color: THEME_COLORS.text,
        fontFamily: 'monospace'
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      splitLine: {
        show: true,
        lineStyle: {
          color: THEME_COLORS.grid,
          type: 'dashed'
        }
      },
      axisLine: {
        lineStyle: { color: THEME_COLORS.magenta }
      },
      axisLabel: {
        color: THEME_COLORS.text,
        fontFamily: 'monospace'
      }
    },
    series: props.chartData.map((series, index) => {
      // 循环分配颜色
      const color = [THEME_COLORS.cyan, THEME_COLORS.magenta, THEME_COLORS.yellow][index % 3];

      return {
        name: series.name,
        type: 'scatter',
        data: series.data,
        symbolSize: 15,
        itemStyle: {
          color: color,
          // 核心：发光效果
          shadowBlur: 15,
          shadowColor: color
        },
        // 数据标签样式
        label: {
          show: true,
          position: 'top',
          color: color,
          fontFamily: 'monospace',
          formatter: (params) => {
            return `{color|●} ${params.data[0]},${params.data[1]}`;
          },
          rich: {
            color: { fontSize: 10 }
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 20,
            shadowColor: '#fff' // 悬停时变白炽化
          }
        }
      };
    })
  };

  chartInstance.setOption(option);
};

// --- 监听数据变化 ---
watch(() => props.chartData, () => {
  if (chartInstance) {
    chartInstance.setOption({ series: props.chartData.map((series, index) => {
        const color = [THEME_COLORS.cyan, THEME_COLORS.magenta, THEME_COLORS.yellow][index % 3];
        return {
          name: series.name,
          data: series.data,
          itemStyle: { color: color, shadowBlur: 15, shadowColor: color },
          label: { color: color }
        }
      })});
  }
}, { deep: true });

// --- 生命周期钩子 ---
onMounted(() => {
  initChart();
  // 监听窗口大小变化以重绘
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  chartInstance?.resize();
};
</script>

<style scoped>
.cyberpunk-chart {
  width: 100%;
  height: 500px;
  border: 1px solid #333;
  /* 可选：给容器加一点外发光边框 */
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
}
</style>
