<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, watch, defineEmits } from 'vue'

// 1. 定义 props 并指定 TS 类型
const props = defineProps<{
  originContent?: string // 可选属性，默认值在后面处理
}>()

// 2. 正确初始化编辑器内容（处理默认值）
const content = ref(props.originContent || '')

// 3. 配置工具栏（按需定制）
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['link'],
  ['clean']
]

// 4. 正确定义事件（TS 规范写法）
const emit = defineEmits<{
  (e: 'contentChange', value: string): void
}>()

// 5. 监听内容变化，正确触发事件
watch(
  content,
  (newVal) => {
    emit('contentChange', newVal) // 直接传递 HTML 字符串
  },
  { immediate: true, deep: true } // 可选：初始化时触发一次，同步初始内容
)

// 3. 监听 originContent 变化，同步更新 content
watch(
  // 监听的目标：props.originContent
  () => props.originContent,
  // 变化后的回调：更新 content 的值
  (newVal) => {
    content.value = newVal || ''
  }
  // 可选配置：immediate 为 true 会在监听初始化时执行一次（可选，这里初始化已赋值，可省略）
  // { immediate: true }
)
</script>

<template>
  <div class="editor-container">
    <QuillEditor
      v-model:content="content"
      contentType="html"
      theme="snow"
      :toolbar="toolbarOptions"
      class="quill-editor"
    />
  </div>
</template>

<style scoped>
.editor-container {
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', 'Microsoft YaHei', sans-serif;
  width: 100%;
  margin: 1rem 0;
  box-sizing: border-box;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.quill-editor) {
  width: 100%;
  height: 400px;
  min-height: 300px;
}

:deep(.ql-toolbar.ql-snow) {
  border-bottom: 1px solid #e4e7ed;
  background-color: #f9fafb;
  padding: 0.5rem;
}

:deep(.ql-container.ql-snow) {
  border: none;
  height: calc(100% - 44px);
  padding: 1rem;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  :deep(.quill-editor) {
    height: 300px;
    min-height: 200px;
  }

  :deep(.ql-container.ql-snow) {
    padding: 0.75rem;
  }
}
</style>
