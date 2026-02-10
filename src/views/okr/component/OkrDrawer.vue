<script setup>

import TextEditor from '@/components/TextEditor.vue'
import Uploader from '@/components/Uploader.vue'
import { ref, defineProps, watch, onMounted } from 'vue'
import useOkrStore from '@/stores/okr/okr.js'
import useProgramStore from '@/stores/program/program.js'


const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  okrForm: {
    type: Object,
    default: () => ({})
  }
})

// 接受传过来的数据
const form = ref({
  okrName: String
})
const formRef = ref(null)

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

// 监听父组件传递的数据变化
watch(
  () => props.okrForm,
  (newVal) => {
    // 深拷贝新数据，强制覆盖旧数据
    form.value = deepClone(newVal)
    // 关键：确保编辑器内容同步更新（即使已有值也覆盖）
    if (form.value.description === undefined) {
      form.value.description = ''
    }
  },
  { deep: true, immediate: true } // deep+immediate 确保深度监听+初始化执行
)


const handleCancel = () => {
  emit('update:drawerVisible', false) // 通知父组件关闭抽屉
  form.value = {}
}



// 状态
const okrStore = useOkrStore()
const programStore = useProgramStore()

onMounted(async () => {
    await programStore.getProgramList()
  }
)



// 校验表单
const validateForm = async (form) => {
  if (!form) return
  // 校验表单
  await form.value.validate((valid) => {
    return !!valid
  })
}

// 提交按钮触发事件
const handleSubmit = async () => {
  if (!form.value.id) {
    await okrStore.addOkr(form.value)
    form.value = {}
  } else {
    await okrStore.updateOkr(form.value)
    form.value = {}
  }
  // 判断是添加还是编辑
  emit('update:drawerVisible', false) // 提交后关闭抽屉
}

// emit 事件
const emit = defineEmits(['update:drawerVisible'])

// 完成选项
const statusOptions = [
  {
    id: 0,
    label: '待完成'
  },
  {
    id: 1,
    label: '已完成'
  },
  {
    id: 2,
    label: '已放弃'
  }
]
// 监听内容更改
const handleContentChange = (newContent) => {
  form.value.krDesc = newContent
}


// 表单校验
const rules = ref({
  krName: [
    { required: true, message: '请输入OKR名称' }
  ],
  programId: [
    { required: true, message: 'KR必须绑定一个项目作为O' }
  ]

})

</script>

<template>
  <el-drawer
    modal-penetrable
    :model-value="drawerVisible"
    @close="handleCancel"
    :modal="false"
    size="50%"
    resizable
    title="信息变更"
  >
    <el-form
      label-width="auto"
      :model="form"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item prop="krName" label="OKR">
        <el-input
          label="OKR名称"
          placeholder="请OKR标题"
          v-model="form.krName"
        ></el-input>
      </el-form-item>
      <el-form-item prop="programId" label="项目归属">
        <el-select
          v-model="form.programId"
          placeholder="选择项目归属"
        >
          <el-option
            v-for="item in programStore.programOptions"
            :key="item.id"
            :value="item.id"
            :label="item.programName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="status"
        label="完成情况"
      >
        <el-select
          placeholder="完成情况"
          filterable
          v-model="form.status"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.id"
            :value="option.id"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-divider></el-divider>
    </el-form>
    <p>OKR描述</p>
    <text-editor
      @contentChange="handleContentChange"
      :origin-content="form.krDesc || '你可以写一些你的预期成果，要达成什么结果，完成什么进步。'" />
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>

</style>
