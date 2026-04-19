<template>
  <div class="cyber-gauge-container">
    <div ref="chartRef" class="chart-instance"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import * as echarts from 'echarts';

// --- Props 定义 ---
const props = defineProps({
  value: {
    type: Number,
    default: 64, // 默认数值
  },
  max: {
    type: Number,
    default: 100,
  },
  title: {
    type: String,
    default: '仪表盘组件',
  },
  colorPrimary: {
    type: String,
    default: '#00f3ff', // 赛博朋克青色
  },
  colorSecondary: {
    type: String,
    default: '#ff0055', // 赛博朋克洋红色
  },
  bgColor: {
    type: String,
    default: 'transparent', // 极深色背景
  }
});

const chartRef = ref(null);
let chartInstance = shallowRef(null);

// --- ECharts 配置生成函数 ---
const getOption = () => {
  const { value, max, title, colorPrimary, colorSecondary, bgColor } = props;

  // 计算百分比用于进度条颜色
  const percent = Math.min(Math.max(value / max, 0), 1);

  return {
    backgroundColor: bgColor,
    title: {
      text: title,
      left: 'center',
      top: '85%',
      textStyle: {
        color: colorPrimary,
        fontFamily: 'Orbitron, "Courier New", monospace', // 科技感字体
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: colorPrimary,
        textShadowBlur: 10
      }
    },
    series: [
      {
        type: 'gauge',
        startAngle: 200, // 起始角度，营造底部开口效果
        endAngle: -20,
        min: 0,
        max: max,
        radius: '90%',
        center: ['50%', '55%'],

        // 进度条样式
        progress: {
          show: true,
          roundCap: true,
          width: 18,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: colorPrimary },
              { offset: 1, color: colorSecondary }
            ]),
            shadowColor: colorPrimary,
            shadowBlur: 15, // 霓虹发光效果
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        },

        // 指针样式
        pointer: {
          show: false // 隐藏指针，现代仪表盘风格
        },

        // 刻度线
        axisTick: {
          show: true,
          splitNumber: 10,
          length: 12,
          lineStyle: {
            color: colorPrimary,
            width: 2,
            shadowColor: colorPrimary,
            shadowBlur: 5
          }
        },

        // 分割线
        splitLine: {
          show: true,
          length: 20,
          lineStyle: {
            color: colorPrimary,
            width: 3,
            shadowColor: colorPrimary,
            shadowBlur: 10
          }
        },

        // 刻度标签
        axisLabel: {
          show: true,
          distance: 25,
          color: '#fff',
          fontSize: 12,
          fontFamily: 'monospace',
          formatter: (val) => {
            // 简单的数字格式化
            return Math.round(val);
          }
        },

        // 数据标签（中间的数字）
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '0%'],
          fontSize: 40,
          fontWeight: 'bold',
          fontFamily: 'Orbitron, monospace',
          color: '#fff',
          formatter: (val) => {
            return '{value|' + Math.round(val) + '}{unit|%}';
          },
          rich: {
            value: {
              color: '#fff',
              textShadowColor: colorSecondary,
              textShadowBlur: 15,
              textShadowOffsetX: 0,
              textShadowOffsetY: 0,
              fontSize: 50
            },
            unit: {
              color: colorPrimary,
              fontSize: 20,
              textShadowColor: colorPrimary,
              textShadowBlur: 5,
              padding: [0, 0, 0, 5]
            }
          }
        },

        data: [
          {
            value: value
          }
        ]
      }
    ]
  };
};

// --- 初始化与更新逻辑 ---
const initChart = () => {
  if (chartRef.value) {
    chartInstance.value = echarts.init(chartRef.value);
    chartInstance.value.setOption(getOption());
  }
};

const resizeChart = () => {
  chartInstance.value?.resize();
};

// 监听 Props 变化
watch(() => props.value, () => {
  chartInstance.value?.setOption(getOption());
});

watch(() => [props.colorPrimary, props.colorSecondary], () => {
  chartInstance.value?.setOption(getOption());
}, { deep: true });

onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart);
  chartInstance.value?.dispose();
});
</script>

<style scoped>
.cyber-gauge-container {
  width: 100%;
  height: 300px; /* 默认高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* 添加一个微妙的边框效果 */
  border: 1px solid rgba(0, 243, 255, 0.1);
  box-shadow: inset 0 0 20px rgba(0, 243, 255, 0.05);
  border-radius: 8px;
}

.chart-instance {
  width: 100%;
  height: 100%;
}
</style>
