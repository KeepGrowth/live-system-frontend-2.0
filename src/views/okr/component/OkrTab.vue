<template>
  <!-- 外层容器：控制整体布局，避免溢出 -->
  <div class="tabs-container">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      :stretch="true"
    >
      <el-tab-pane label="基础信息" name="OkrPage">
        <okr-page />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import OkrPage from '@/views/okr/OkrPage.vue'


const activeName = ref('OkrPage')
</script>

<style scoped>
/* 外层容器：合理的间距 + 宽度适配 */
.tabs-container {
  /* 使用 rem 替代 vh，适配不同屏幕（1rem=16px，更稳定） */
  margin: 1rem 1rem 0; /* 上 右/左 下 间距，更统一 */
  width: calc(100% - 2.5rem); /* 减去左右margin，避免溢出 */
  box-sizing: border-box; /* 保证padding/margin不影响宽度计算 */
}

/* 标签页整体：铺满容器 + 统一样式 */
:deep(.demo-tabs) {
  width: 100%;
  height: 100%;
}

/* 标签栏：清除默认间距，适配stretch属性 */
:deep(.demo-tabs .el-tabs__header) {
  font-weight: bolder;
  margin: 0; /* 清除Element默认的margin-bottom */
  border-radius: 4px 4px 0 0; /* 和card样式匹配的圆角 */
}

/* 标签内容区：合理的内边距 + 无溢出 */
:deep(.demo-tabs .el-tabs__content) {
  padding: 1rem; /* 替换margin为padding，避免内容偏移 */
  margin: 0; /* 清除默认margin */
  min-height: calc(100vh - 12rem); /* 最小高度，避免内容过少时布局塌陷 */
  box-sizing: border-box;
}

/* 适配小屏幕：响应式调整 */
@media (max-width: 768px) {
  .tabs-container {
    margin: 0.75rem;
    width: calc(100% - 1.5rem);
  }

  :deep(.demo-tabs .el-tabs__content) {
    min-height: calc(100vh - 10rem);
    padding: 0.75rem;
  }
}
</style>
