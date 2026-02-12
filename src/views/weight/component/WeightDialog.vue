<script setup>
import { ref, watch, defineEmits } from 'vue'
import useWeightStore from '@/stores/weight/weight.js'

// 父数据
const props = defineProps({
  // 父组件传过来的初始化数据。
  dialogVisible: {
    type: Boolean,
    default: () => false
  },
  // 数据体
  weightForm: {
    type: Object,
    default: () => {
    }
  }
})

// 状态管理
const weightStore = useWeightStore()

// 本地控制显隐
const visible = ref(props.dialogVisible)
// 本地数据体
const form = ref(props.weightForm)

// 监听父组件数据显隐的变化
watch(
  () => props.dialogVisible,
  (newVal) => {
    // 深拷贝新数据，强制覆盖旧数据
    visible.value = newVal
  },
  { deep: true, immediate: true } // deep+immediate 确保深度监听+初始化执行
)
watch(
  () => props.weightForm,
  (newVal) => {
    // 深拷贝新数据，强制覆盖旧数据
    form.value = newVal
  },
  { deep: true, immediate: true } // deep+immediate 确保深度监听+初始化执行
)

// emit方法
const emit = defineEmits(['update:dialog-visible'])

// 提交方法
const handleSubmit = async () => {
  // 判断是添加请求还是编辑请求
  if (!form.value.id) {
    await weightStore.addWeight(form.value)
  } else {
    await weightStore.updateWeight(form.value)
  }
  // 关闭对话框
  emit('update:dialog-visible', false)
}

// 关闭弹窗
const handleClose = () => {
  emit('update:dialog-visible', false)
}

</script>

<template>
  <!--添加与删除的对话框-->
  <el-dialog v-model="visible" :title="form.id?'编辑体重':'新增体重'" width="500">
    <el-form :model="form">
      <el-form-item label="体重(kg)" label-width="auto" prop="weight">
        <el-input v-model="form.weight" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
