<template>
  <div class="cyber-pie-container">
    <!-- 装饰性边角，增强赛博朋克UI感 -->
    <div class="corner top-left"></div>
    <div class="corner bottom-right"></div>

    <div ref="chartRef" class="chart-body"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import * as echarts from 'echarts';

// ---  Props 定义 ---
const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { value: 1048, name: '网络流量' },
      { value: 735, name: '核心算力' },
      { value: 580, name: '内存占用' },
      { value: 484, name: '加密进程' },
      { value: 300, name: '防火墙' }
    ]
  },
  title: {
    type: String,
    default: '饼图组件'
  }
});

// ---  Refs ---
const chartRef = ref(null);
const chartInstance = shallowRef(null);

// ---  赛博朋克配色与配置 ---
const cyberColors = [
  '#00f3ff', // 霓虹青
  '#ff00ff', // 霓虹紫红
  '#bc13fe', // 亮紫
  '#00ff9d', // 荧光绿
  '#ffe600'  // 警示黄
];

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance.value = echarts.init(chartRef.value);

  const option = {

    // 标题配置
    title: {
      text: props.title,
      left: 'center',
      top: '20px',
      textStyle: {
        color: '#00f3ff',
        fontFamily: '"Courier New", Courier, monospace', // 科技感字体
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: '#00f3ff',
        textShadowBlur: 10
      }
    },
    // 提示框
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 15, 0.8)', // 半透明深色背景
      borderColor: '#00f3ff',
      textStyle: {
        color: '#fff',
        fontFamily: 'monospace'
      },
      formatter: '{b}: <span style="color:#00f3ff">{c}</span> ({d}%)'
    },
    // 图例配置
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'middle',
      textStyle: {
        color: '#ccc',
        fontFamily: 'monospace'
      },
      itemWidth: 15,
      itemHeight: 8,
      itemStyle: {
        borderWidth: 0
      }
    },
    // 饼图系列配置
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['40%', '70%'], // 环形图
        center: ['45%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10, // 圆角
          borderColor: '#1a1a2e', // 边框颜色（深色背景融合）
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: 12,
          textBorderWidth: 0
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          smooth: true,
          lineStyle: {
            color: '#00f3ff', // 引导线颜色
            width: 1
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)' // 悬停时的发光效果
          },
          scale: true, // 悬停放大
          scaleSize: 10
        },
        data: props.data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: cyberColors[index % cyberColors.length],
            // 给每个扇区添加特定的阴影颜色，模拟霓虹光
            shadowBlur: 15,
            shadowColor: cyberColors[index % cyberColors.length]
          }
        }))
      }
    ]
  };

  chartInstance.value.setOption(option);
};

// ---  生命周期与监听 ---
onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  window.removeEventListener('resize', handleResize);
});

watch(() => props.data, () => {
  if (chartInstance.value) {
    chartInstance.value.setOption({ series: [{ data: props.data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: cyberColors[index % cyberColors.length],
            shadowBlur: 15,
            shadowColor: cyberColors[index % cyberColors.length]
          }
        })) }] });
  }
}, { deep: true });

const handleResize = () => {
  chartInstance.value?.resize();
};
</script>

<style scoped>
.cyber-pie-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: transparent; /* 透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.chart-body {
  width: 100%;
  height: 100%;
}

/* --- 赛博朋克装饰边角 (CSS绘制) --- */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #00f3ff;
  box-shadow: 0 0 10px #00f3ff;
  z-index: 10;
  transition: all 0.3s ease;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

/* 简单的扫描线动画背景（可选） */
.cyber-pie-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.1)
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 5;
  opacity: 0.3;
}
</style>
