<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    drag
    :auto-upload="true"
    :http-request="customUpload"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    list-type="picture-card"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { UploadProps, UploadUserFile, UploadRequestOptions } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '@/utils/request'
import useUserStore from '@/stores/user'
import utils from '@/utils/common'

const userStore = useUserStore()
// 接受一些有关图片的ID
const props = defineProps({
  idParams: {
    type: Object,
    default: () => {
    }
  }
})
// 文件列表
const fileList = ref<UploadUserFile[]>([])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}


// 上传成功的图像列表
const imageList = ref([{}])
// 🔥 核心修改：自定义上传方法
const customUpload = async (options: UploadRequestOptions) => {
  const params = props.idParams || {}
  // 1. 构建 FormData 对象
  const formData = new FormData()
  // 后端要求的字段名通常是 'file'，具体看你后端定义
  formData.append('file', options.file)
  // 动态添加 params 中存在的字段
  if (params.todoLogId) {
    formData.append('todoLogId', params.todoLogId)
  }
  if (params.todoId) {
    formData.append('todoId', params.todoId)
  }
  if (params.programId) {
    formData.append('programId', params.programId)
  }
  if (params.goalId) {
    formData.append('goalId', params.goalId)
  }
  if (params.okrId) {
    formData.append('okrId', params.okrId)
  }
  if (params.expenseId) {
    formData.append('expenseId', params.expenseId)
  }
  if (params.incomeId) {
    formData.append('incomeId', params.incomeId)
  }


  // 2. 使用你的 axios 实例(api) 发送请求
  // 这里会自动携带你在 api 拦截器里配置的 Token
  return await api
    .post('/upload/image', formData, {
      // ⚠️ 关键配置：
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    .then((res) => {
      // 3. 上传成功后的回调
      // ElementUI 需要知道后端返回的数据结构，通常 res.data 是你的后端返回值
      options.onSuccess(res.data.data)
      imageList.value.push(res.data.data)
    })
    .catch((err) => {
      // 4. 上传失败回调
      options.onError(err)
    })
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePreview: UploadProps['onPreview'] = (file) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
// 监听文件列表的变化
const emit = defineEmits<{
  listChange: [{}]
}>()
watch(
  imageList,
  (newVal) => {
    emit('listChange', newVal)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
