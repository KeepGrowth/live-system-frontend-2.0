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
  primary: '#00f3ff',   // 霓虹青
  secondary: '#ff0055', // 荧光粉
  warning: '#fcee0a',   // 赛博黄
  text: '#a0a0a0',      // 次要文字
  white: '#ffffff'
};

const chartRef = ref(null);
let chartInstance = null;

const props = defineProps({
  title:{
    type:String,

  }
})

// --- 模拟数据 (实际使用中可通过 props 传入) ---
const generateData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push([
      i * 1000, // 时间戳
      Math.round(Math.random() * 100 + 20), // 数值
      Math.round(Math.random() * 50 + 10)   // 额外数值
    ]);
  }
  return data;
};

const mockData = generateData();

// --- ECharts 配置项 ---
const getOption = () => {
  return {
    // 背景透明，由 CSS 控制容器背景
    backgroundColor: 'transparent',

    // 标题配置
    title: {
      text: '曲线图组件',
      left: 'center',
      textStyle: {
        color: THEME.primary,
        fontFamily: '"Orbitron", "Courier New", monospace', // 科技感字体
        fontSize: 18,
        letterSpacing: 2
      },
    },

    // 图例配置
    legend: {
      data: ['CPU Load', 'Memory', 'Network'],
      top: 40,
      textStyle: {
        color: THEME.text,
        fontFamily: 'monospace'
      },
      icon: 'rect',
      itemWidth: 15,
      itemHeight: 8
    },

    // 提示框
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11, 12, 21, 0.9)', // 深色半透明背景
      borderColor: THEME.primary,
      textStyle: {
        color: THEME.white,
        fontFamily: 'monospace'
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: THEME.secondary,
          width: 1
        }
      }
    },

    // 工具箱 (常用工具)
    toolbox: {
      feature: {
        saveAsImage: {
          title: '保存',
          name: 'cyber_data',
          iconStyle: { borderColor: THEME.primary }
        },
        restore: {
          title: '重置',
          iconStyle: { borderColor: THEME.primary }
        },
        dataZoom: {
          title: { zoom: '缩放', back: '还原' },
          iconStyle: { borderColor: THEME.secondary }
        }
      },
      right: 20,
      top: 10
    },

    // 网格布局
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%', // 留出空间给数据区域缩放组件
      top: '20%',
      containLabel: true,
      borderColor: THEME.grid
    },

    // X轴
    xAxis: {
      type: 'time',
      splitLine: {
        show: true,
        lineStyle: { color: THEME.grid, type: 'dashed' }
      },
      axisLine: { lineStyle: { color: THEME.primary } },
      axisLabel: { color: THEME.text, fontFamily: 'monospace' }
    },

    // Y轴
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: { color: THEME.grid, type: 'dashed' }
      },
      axisLine: { lineStyle: { color: THEME.primary } },
      axisLabel: { color: THEME.text, fontFamily: 'monospace' }
    },

    // 数据区域缩放 (底部滑动条)
    dataZoom: [
      {
        type: 'inside', // 支持鼠标滚轮缩放
        start: 0,
        end: 100
      },
      {
        type: 'slider', // 底部滑动条
        show: true,
        start: 0,
        end: 100,
        height: 20,
        bottom: 5,
        backgroundColor: '#1a1c29',
        dataBackground: {
          lineStyle: { color: THEME.primary },
          areaStyle: { color: THEME.secondary }
        },
        selectedDataBackground: {
          lineStyle: { color: THEME.warning },
          areaStyle: { color: THEME.warning }
        },
        handleStyle: {
          color: THEME.dark,
          borderColor: THEME.primary
        },
        textStyle: { color: THEME.text },
        borderColor: THEME.grid
      }
    ],

    // 系列数据
    series: [
      {
        name: 'CPU Load',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: mockData.map(item => [item[0], item[1]]),
        lineStyle: { color: THEME.primary, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 243, 255, 0.5)' },
            { offset: 1, color: 'rgba(0, 243, 255, 0.0)' }
          ])
        }
      },
      {
        name: 'Memory',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: mockData.map(item => [item[0], item[2]]),
        lineStyle: { color: THEME.secondary, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 0, 85, 0.5)' },
            { offset: 1, color: 'rgba(255, 0, 85, 0.0)' }
          ])
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

// 监听数据变化重新渲染（如果需要动态数据）
watch(() => mockData, () => {
  chartInstance?.setOption(getOption());
}, { deep: true });

</script>

<style scoped>
/* 引入科技感字体，如果本地没有会回退到等宽字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.cyber-chart-container {
  position: relative;
  width: 100%;
  height: 500px; /* 默认高度 */
  border: 1px solid rgba(0, 243, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  backdrop-filter: blur(5px); /* 毛玻璃效果 */
}

.chart-instance {
  width: 100%;
  height: 100%;
}

/* 赛博朋克风格装饰边角 */
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #00f3ff;
  transition: all 0.3s ease;
  z-index: 10;
}

.top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
.top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
.bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
.bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }

/* 悬停时的高亮效果 */
.cyber-chart-container:hover {
  box-shadow: 0 0 25px rgba(0, 243, 255, 0.3);
  border-color: #00f3ff;
}
</style>
