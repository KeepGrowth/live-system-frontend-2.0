<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { zhCn } from 'element-plus/es/locale/index'
</script>

<template>
  <div class="cyber-container">
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<!--专门修改富文本编辑器内部字体 -->
<style>
@import "tailwindcss";

</style>
<style>
/* 引入赛博朋克风格字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

/* 全局设置 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Orbitron', sans-serif; /* 科技感字体 */
  overflow-x: hidden;
  color: #e0e0e0;

  /* 赛博朋克深色底色 */
  background-color: #050505;

  /* 多层渐变背景 */
  background-image:
    /* 4. 径向光晕 (模拟远处的霓虹灯) */
    radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.15), transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.15), transparent 25%),
      /* 3. 顶部微光 */
    linear-gradient(to bottom, rgba(0, 243, 255, 0.03), transparent 60%),
      /* 1. 基础深色渐变 */
    linear-gradient(135deg, #0f0c29, #302b63, #24243e);

  background-size: 100% 100%, 100% 100%, 100% 100%, 4px 4px, 100% 100%;
  background-attachment: fixed;
}

/* 可选：添加动态光晕动画 */
html {
  animation: pulse-bg 10s infinite alternate;
}

@keyframes pulse-bg {
  0% {
    background-image:
      radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.1), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.1), transparent 25%),
      linear-gradient(to bottom, rgba(0, 243, 255, 0.03), transparent 60%),
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
      linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  }
  100% {
    background-image:
      radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.25), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.25), transparent 25%),
      linear-gradient(to bottom, rgba(0, 243, 255, 0.08), transparent 60%),
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
      linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  }
}

</style>
