<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    drag
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    list-type="picture"
  >
    <el-icon style="width: 10rem">拖拽或点击上传</el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue'

import type { UploadProps, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 文件列表
const fileList = ref<UploadUserFile[]>([])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}

// 监听文件列表的变化
const emit = defineEmits<{
  // 事件名：[参数类型]
  fileListChange: [{}]
}>()
watch(
  fileList,
  (newVal, OldVal) => {
    emit('fileListChange', newVal)
  },
  {
    deep: true,
    immediate:true
  }
)
</script>
