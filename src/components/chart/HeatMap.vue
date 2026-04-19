<template>
  <div ref="chartRef" class="cyber-heatmap-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import * as echarts from 'echarts';

// --- Props 定义 ---
const props = defineProps({
  // 默认数据：模拟黑客入侵频率或网络流量
  data: {
    type: Array,
    default: () => {
      // 生成一些默认数据用于演示
      const defaultData = [];
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

      for (let i = 0; i < hours.length; i++) {
        for (let j = 0; j < days.length; j++) {
          // 随机生成 0-100 的数值，模拟数据波动
          const value = Math.floor(Math.random() * 100);
          defaultData.push({
            value: [j, i, value],
            // 添加一些随机的高亮数据点
            itemStyle: value > 80 ? { shadowBlur: 10, color: '#ff00ff' } : null
          });
        }
      }
      return defaultData;
    }
  },
  title: {
    type: String,
    default: '热力图组件'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '500px'
  }
});

const chartRef = ref(null);
const chartInstance = shallowRef(null);

// --- 赛博朋克配色方案 ---
const CYBER_COLORS = {
  text: '#00f3ff',        // 霓虹青文字
  border: '#1a1c29',      // 边框色
  heatMin: '#1a1c29',     // 热力图最小值颜色 (暗)
  heatMid: '#7000ff',     // 中间值 (紫色)
  heatMax: '#00f3ff',     // 最大值 (亮青)
  highlight: '#ff00ff'    // 高亮/告警色 (洋红)
};

// --- ECharts 配置生成函数 ---
const getOption = () => {
  return {
    backgroundColor: 'transparent',
    title: {
      top: 10,
      left: 20,
      text: props.title,
      textStyle: {
        color: CYBER_COLORS.text,
        fontFamily: 'Orbitron, "Courier New", monospace', // 科技感字体
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: CYBER_COLORS.text,
        textShadowBlur: 10
      }
    },
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(11, 12, 21, 0.9)',
      borderColor: CYBER_COLORS.text,
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontFamily: 'monospace'
      },
      formatter: (params) => {
        return `节点: ${params.data[1]}<br/>时间: ${params.data[0]}:00<br/>负载: <span style="color:${CYBER_COLORS.highlight}">${params.data[2]}%</span>`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)']
        }
      },
      axisLine: {
        lineStyle: {
          color: CYBER_COLORS.border
        }
      },
      axisLabel: {
        color: CYBER_COLORS.text,
        fontFamily: 'monospace',
        fontSize: 10
      }
    },
    yAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)']
        }
      },
      axisLine: {
        lineStyle: {
          color: CYBER_COLORS.border
        }
      },
      axisLabel: {
        color: CYBER_COLORS.text,
        fontFamily: 'monospace',
        fontSize: 12
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      itemWidth: 15,
      itemHeight: 100,
      textStyle: {
        color: CYBER_COLORS.text,
        fontFamily: 'monospace'
      },
      inRange: {
        // 渐变色：从暗紫到霓虹青
        color: [CYBER_COLORS.heatMin, CYBER_COLORS.heatMid, CYBER_COLORS.heatMax]
      },
      // 这里的图形元素样式
      controller: {
        itemStyle: {
          borderColor: CYBER_COLORS.text
        }
      }
    },
    series: [
      {
        name: '网络负载',
        type: 'heatmap',
        data: props.data,
        label: {
          show: false // 默认隐藏标签，保持界面整洁，鼠标悬停时显示
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: CYBER_COLORS.highlight,
            color: CYBER_COLORS.highlight // 悬停时变洋红
          }
        },
        // 这里的动画效果
        progressive: 1000,
        animationDuration: 1000
      }
    ]
  };
};

// --- 初始化与响应式 ---
const initChart = () => {
  if (chartRef.value) {
    chartInstance.value = echarts.init(chartRef.value);
    chartInstance.value.setOption(getOption());
  }
};

const handleResize = () => {
  chartInstance.value?.resize();
};

// 监听数据变化
watch(() => props.data, () => {
  chartInstance.value?.setOption(getOption());
}, { deep: true });

// 监听标题变化
watch(() => props.title, () => {
  chartInstance.value?.setOption(getOption());
});

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance.value?.dispose();
});
</script>

<style scoped>
.cyber-heatmap-container {
  width: v-bind(width);
  height: v-bind(height);
  /* 添加一个微弱的扫描线背景效果，增强赛博感 */
  background-image: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 243, 255, 0.02) 50%
  );
  background-size: 100% 4px;
  border: 1px solid #1a1c29;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* 装饰性的边角 */
.cyber-heatmap-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-top: 2px solid #00f3ff;
  border-left: 2px solid #00f3ff;
  z-index: 2;
}

.cyber-heatmap-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #00f3ff;
  border-right: 2px solid #00f3ff;
  z-index: 2;
}
</style>
