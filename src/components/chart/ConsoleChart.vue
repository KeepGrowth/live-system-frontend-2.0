<template>
  <div class="cyber-gauge-container">
    <!-- 装饰性边角 -->
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>

    <div ref="gaugeRef" class="gauge-instance"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

// --- 赛博朋克配色常量 ---
const CYBER = {
  primary: '#00f3ff',   // 霓虹青
  secondary: '#ff0055', // 荧光粉
  warning: '#fcee0a',   // 赛博黄
  text: '#a0a0a0',      // 次要文字
  grid: 'rgba(0, 243, 255, 0.1)', // 网格/分割线
  white: '#ffffff'
};

const gaugeRef = ref(null);
let chartInstance = null;

// 接收外部传入的标题和数值
const props = defineProps({
  title: {
    type: String,
    default: 'System Load'
  },
  value: {
    type: Number,
    default: 75
  }
});

// --- ECharts 配置项 ---
const getOption = () => {
  // 动态计算指针颜色
  let pointerColor = CYBER.primary;
  if (props.value > 80) pointerColor = CYBER.warning;
  else if (props.value > 60) pointerColor = CYBER.secondary;

  return {
    backgroundColor: 'transparent',

    title: {
      text: props.title,
      left: 'center',
      top: '10%',
      textStyle: {
        color: CYBER.primary,
        fontFamily: '"Orbitron", monospace',
        fontSize: 16,
        fontWeight: 'normal',
        textShadow: `0 0 5px ${CYBER.primary}`
      }
    },

    tooltip: {
      show: true,
      formatter: `{a} <br/>{b} : {c}%`,
      backgroundColor: 'rgba(11, 12, 21, 0.9)',
      borderColor: CYBER.primary,
      textStyle: { color: CYBER.white }
    },

    series: [
      {
        name: 'Gauge',
        type: 'gauge',
        // 仪表盘中心位置和大小
        center: ['50%', '65%'],
        radius: '90%',
        startAngle: 200,
        endAngle: -20,

        // 仪表盘轴线
        axisLine: {
          show: true,
          lineStyle: {
            width: 15,
            color: [
              [0.6, CYBER.primary],
              [0.8, CYBER.secondary],
              [1, CYBER.warning]
            ],
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowBlur: 10
          }
        },

        // 刻度样式
        axisTick: {
          show: true,
          splitNumber: 2,
          length: -10, // 向内
          lineStyle: { color: CYBER.grid, width: 1 }
        },

        // 分隔线
        splitLine: {
          length: -20,
          lineStyle: {
            color: CYBER.primary,
            width: 3
          }
        },

        // 刻度标签
        axisLabel: {
          color: CYBER.text,
          fontSize: 10,
          fontFamily: 'monospace',
          distance: 15,
          formatter: function (value) {
            // 只显示 0, 50, 100
            return value % 50 === 0 ? value : '';
          }
        },

        // 指针
        pointer: {
          show: true,
          length: '85%',
          width: 6,
          offsetCenter: [0, '-5%'],
          itemStyle: {
            color: pointerColor
          }
        },

        // 仪表盘详情（中间数值）
        detail: {
          valueAnimation: true,
          fontSize: 24,
          fontFamily: '"Orbitron", monospace',
          fontWeight: 'bolder',
          color: pointerColor,
          offsetCenter: [0, '30%'],
          textShadow: `0 0 10px ${pointerColor}`,
          formatter: '{value}%'
        },

        // 仪表盘数据
        data: [
          {
            value: props.value,
          }
        ]
      }
    ]
  };
};

// --- 生命周期与初始化 ---
const initChart = () => {
  if (gaugeRef.value) {
    chartInstance = echarts.init(gaugeRef.value);
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

// 监听数值变化
watch(() => props.value, () => {
  chartInstance?.setOption(getOption());
});
</script>

<style scoped>
/* 引入 Orbitron 字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

.cyber-gauge-container {
  position: relative;
  width: 100%;
  height: 500px; /* 默认高度 */
  border: 1px solid rgba(0, 243, 255, 0.3);
  box-shadow:
    0 0 15px rgba(0, 243, 255, 0.1),
    inset 0 0 10px rgba(0, 243, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(4px);
}

.gauge-instance {
  width: 100%;
  height: 100%;
}

/* 赛博朋克装饰边角 */
.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #00f3ff;
  z-index: 10;
}

.top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
.top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
.bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
.bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }

/* 悬停动效 */
.cyber-gauge-container:hover {
  box-shadow:
    0 0 25px rgba(0, 243, 255, 0.3),
    0 0 5px rgba(255, 0, 85, 0.2);
  transform: translateY(-1px);
  transition: all 0.3s ease;
}
</style>
