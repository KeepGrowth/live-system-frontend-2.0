<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { defineComponent } from 'vue'
import { ref } from 'vue'

defineComponent(
  QuillEditor
)
const content = ref('')
</script>
<template>
  <div class="editor-container">
    <QuillEditor v-model:content="content" theme="snow" />
  </div>
</template>
<!-- 原有 scoped 样式（只作用于当前组件容器） -->
<style scoped>
* {
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}
.editor-container {
  min-height: 400px;
  width: 100%;
  border: 1px solid black;
}
</style>



