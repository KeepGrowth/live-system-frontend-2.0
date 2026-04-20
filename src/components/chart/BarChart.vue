<template>
  <div class="cyber-chart-container">
    <!-- 装饰性边角，增强赛博朋克感 -->
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

// --- 赛博朋克配色常量 ---
const THEME = {
  primary: '#00f3ff',   // 霓虹青 (主色)
  secondary: '#ff0055', // 荧光粉 (次色)
  accent: '#fcee0a',    // 赛博黄 (点缀色)
  text: '#a0a0a0',      // 次要文字/网格线
  white: '#ffffff'
};

const chartRef = ref(null);
let chartInstance = null;

// --- Props 定义 ---
const props = defineProps({
  title: {
    type: String,
    default: 'Cyberpunk Bar Chart'
  },
  // 假设传入的数据格式为 [{ name: '类别1', value1: 100, value2: 80 }, ...]
  data: {
    type: Array,
    default: () => []
  }
});

// --- 模拟数据生成 (如果未传入 props.data) ---
const generateMockData = () => {
  const categories = ['Neon City', 'Data Core', 'AI Hub', 'Net Runner', 'Cyber Deck', 'Hacker', 'Matrix', 'Server'];
  return categories.map(cat => ({
    name: cat,
    value1: Math.round(Math.random() * 100),
    value2: Math.round(Math.random() * 100)
  }));
};

// 使用传入的数据或模拟数据
const chartData = props.data.length > 0 ? props.data : generateMockData();

// --- ECharts 配置项构建 ---
const getOption = () => {
  // 提取类目和数值
  const categories = chartData.map(item => item.name);
  const seriesData1 = chartData.map(item => item.value1);
  const seriesData2 = chartData.map(item => item.value2);

  return {
    backgroundColor: 'transparent', // 由 CSS 容器控制背景

    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        color: THEME.primary,
        fontFamily: '"Orbitron", "Courier New", monospace',
        fontSize: 20,
        fontWeight: 'bold',
        textShadow: `0 0 5px ${THEME.primary}, 0 0 10px ${THEME.primary}`
      },
      subtextStyle: {
        color: THEME.text
      }
    },

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11, 12, 21, 0.9)',
      borderColor: THEME.primary,
      textStyle: {
        color: THEME.white,
        fontFamily: 'monospace'
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 243, 255, 0.2)'
        }
      }
    },

    legend: {
      data: ['System A', 'System B'],
      top: 40,
      left: 'center',
      textStyle: {
        color: THEME.text,
        fontFamily: 'monospace'
      },
      itemGap: 20
    },

    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '25%',
      containLabel: true
    },

    // X轴 (数值轴)
    xAxis: {
      type: 'value',
      position: 'top',
      splitLine: {
        show: true,
        lineStyle: {
          color: THEME.text,
          opacity: 0.2,
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: THEME.text,
        fontFamily: 'monospace'
      }
    },

    // Y轴 (类目轴)
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: THEME.text,
        fontFamily: '"Orbitron", sans-serif',
        fontSize: 12
      },
      splitLine: {
        show: false
      }
    },

    // 数据区域缩放 (侧边滑动条，适用于条目多时)
    dataZoom: [
      {
        type: 'inside',
        orient: 'vertical',
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        orient: 'vertical',
        yAxisIndex: 0,
        left: 10,
        start: 0,
        end: 100,
        backgroundColor: '#1a1c29',
        fillerColor: `linear-gradient(left, ${THEME.primary}33, ${THEME.secondary}33)`,
        borderColor: THEME.grid,
        handleStyle: {
          color: THEME.dark,
          borderColor: THEME.accent
        },
        textStyle: {
          color: THEME.text
        }
      }
    ],

    series: [
      {
        name: 'System A',
        type: 'bar',
        stack: 'total', // 堆叠条形图，如果不需要堆叠请删除此行
        barWidth: '60%',
        data: seriesData1,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(0, 243, 255, 0.2)' },
            { offset: 1, color: THEME.primary }
          ]),
          borderColor: THEME.primary,
          borderWidth: 1,
          borderType: 'dashed'
        },
        emphasis: {
          itemStyle: {
            color: THEME.primary,
            shadowBlur: 10,
            shadowColor: THEME.primary
          }
        },
        // 在柱子末端显示数值
        label: {
          show: true,
          position: 'right',
          color: THEME.accent,
          fontFamily: 'Orbitron',
          fontWeight: 'bold',
          textShadow: `0 0 5px ${THEME.accent}`
        }
      },
      {
        name: 'System B',
        type: 'bar',
        stack: 'total', // 堆叠条形图，如果不需要堆叠请删除此行
        barWidth: '60%',
        data: seriesData2,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(255, 0, 85, 0.2)' },
            { offset: 1, color: THEME.secondary }
          ]),
          borderColor: THEME.secondary,
          borderWidth: 1,
          borderType: 'dashed'
        },
        emphasis: {
          itemStyle: {
            color: THEME.secondary,
            shadowBlur: 10,
            shadowColor: THEME.secondary
          }
        },
        label: {
          show: true,
          position: 'right',
          color: THEME.accent,
          fontFamily: 'Orbitron',
          fontWeight: 'bold'
        }
      }
    ]
  };
};

// --- 生命周期与初始化 ---
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

// 监听数据变化重新渲染
watch(() => [props.title, props.data], () => {
  chartInstance?.setOption(getOption());
}, { deep: true });

</script>

<style scoped>
/* 引入科技感字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.cyber-chart-container {
  position: relative;
  width: 100%;
  height: 500px; /* 默认高度 */
  border: 1px solid rgba(0, 243, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.chart-instance {
  width: 100%;
  height: 100%;
}

/* 赛博朋克风格装饰边角 */
.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  transition: all 0.3s ease;
  z-index: 10;
}

.top-left {
  top: 0;
  left: 0;
  border-top: 2px solid var(--cyber-primary, #00f3ff);
  border-left: 2px solid var(--cyber-primary, #00f3ff);
}
.top-right {
  top: 0;
  right: 0;
  border-top: 2px solid var(--cyber-primary, #00f3ff);
  border-right: 2px solid var(--cyber-primary, #00f3ff);
}
.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid var(--cyber-primary, #00f3ff);
  border-left: 2px solid var(--cyber-primary, #00f3ff);
}
.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid var(--cyber-primary, #00f3ff);
  border-right: 2px solid var(--cyber-primary, #00f3ff);
}

/* 悬停时的高亮效果 */
.cyber-chart-container:hover {
  box-shadow: 0 0 25px rgba(0, 243, 255, 0.3),
  0 0 50px rgba(255, 0, 85, 0.1);
  border-color: #00f3ff;
}
</style>
