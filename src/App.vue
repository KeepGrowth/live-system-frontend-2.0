<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { zhCn } from 'element-plus/es/locale/index'
</script>

<template>
  <el-config-provider :locale="zhCn">
  <router-view></router-view>
  </el-config-provider>
</template>

<!--专门修改富文本编辑器内部字体 -->
<style>
/* 覆盖 Quill 编辑区字体 */
.ql-editor {
  font-family: '华文中宋', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  font-size: 16px; /* 可同步修改字体大小 */
  color: #333; /* 可同步修改文字颜色 */
}

/* 可选：覆盖编辑器工具栏字体（让整体统一） */
.ql-toolbar {
  font-family: '华文中宋', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}

body {
  font-family:  "Times New Roman","华文中宋", Arial, sans-serif;
  font-weight: bold;
}
</style>
