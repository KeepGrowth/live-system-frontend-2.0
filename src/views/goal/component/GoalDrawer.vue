<script setup>

import TextEditor from '@/components/TextEditor.vue'
import Uploader from '@/components/Uploader.vue'
import { ref, defineProps, watch } from 'vue'
import useGoalStore from '@/stores/goal.js'


const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  goalForm: {
    type: Object,
    default: () => ({})
  }
})

// 接受传过来的数据
const form = ref({
  goalName:String
})
const formRef = ref(null)

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

// 监听父组件传递的数据变化
watch(
  () => props.goalForm,
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

console.log(props.goalForm.id)

const handleCancel = () => {
  emit('update:drawerVisible', false) // 通知父组件关闭抽屉
  form.value = {}
}

// 状态
const goalStore = useGoalStore()
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
    await goalStore.addGoal(form.value)
    form.value = {}
  } else {
    await goalStore.updateGoal(form.value)
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
  form.value.description = newContent
}


// 表单校验
const rules = ref({
  goalName: [
    { required: true, message: '请输入目标名称', },
  ],
  description: [
    { required: true, message: '请输入本目标的基本描述。', trigger: 'blur' }
  ],
  goalStatus: [
    { required: true, message: '请选择目标的完成状态', trigger: 'blur' }
  ],
  satisfactionScore: [
    { required: true, message: '请选择一个初始的满意度', trigger: 'blur' }
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
      <el-form-item prop="goalName" label="目标标题">
        <el-input
          label="目标名称"
          placeholder="请输入目标标题"
          v-model="form.goalName"
        ></el-input>
      </el-form-item>
      <el-form-item prop="goalCategoryId" label="目标分类">
        <el-select
          v-model="form.goalCategoryId"
          placeholder="选择目标分类"
        >
          <el-option
            v-for="item in goalCateOptions"
            :key="item.id"
            :value="item.id"
            :label="item.categoryName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="startDate" label="开始日期">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="finishDate" label="预计完成日期">
        <el-date-picker
          v-model="form.finishDate"
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="satisfactionScore" label="目标信心程度">
        <el-rate v-model="form.satisfactionScore"></el-rate>
      </el-form-item>
      <el-form-item
        prop="goalStatus"
        label="完成情况"
      >
        <el-select
          placeholder="完成情况"
          filterable
          v-model="form.goalStatus"
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
    <p>目标描述</p>
    <text-editor
      @contentChange="handleContentChange"

      :origin-content="form.description || '你可以写一些你的预期成果，要达成什么结果，完成什么进步。'" />
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
