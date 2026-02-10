<script setup>

import TextEditor from '@/components/TextEditor.vue'
import Uploader from '@/components/Uploader.vue'
import { ref, defineProps, watch, onMounted, computed } from 'vue'
import useTodoStore from '@/stores/todo/todo.js'
import useOkrStore from '@/stores/okr/okr.js'
import useGoalStore from '@/stores/goal/goal.js'
import useProgramStore from '@/stores/program/program.js'


const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  todoForm: {
    type: Object,
    default: () => ({})
  }
})

// 接受传过来的数据
const form = ref({
  name: String
})
const formRef = ref(null)

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

// 监听父组件传递的数据变化
watch(
  () => props.todoForm,
  (newVal) => {
    // 深拷贝新数据，强制覆盖旧数据
    form.value = deepClone(newVal)
    // 关键：确保编辑器内容同步更新（即使已有值也覆盖）
    if (form.value.todoDesc === undefined) {
      form.value.todoDesc = ''
    }
  },
  { deep: true, immediate: true } // deep+immediate 确保深度监听+初始化执行
)


const handleCancel = () => {
  emit('update:drawerVisible', false) // 通知父组件关闭抽屉
  form.value = {}
}


// 状态
const todoStore = useTodoStore()
const okrStore = useOkrStore()
const goalStore = useGoalStore()
const programStore = useProgramStore()

onMounted(async () => {
    await okrStore.getOkrList()
  }
)

// 计算属性
const getProgramIdByOkrId = computed(() => {
  // 1. 边界判断：未选择okrId 或 无okrOptions数据，直接返回空/提示
  if (!form.value.okrId) {
    return '未选择OKR'
  }

  // 2. 核心：找到okrId匹配的项（箭头函数简写，自动return判断条件）
  const matchOkr = okrStore.okrOptions.find(okr => okr.id === form.value.okrId)
  form.value.programId = matchOkr.programId

  // 3. 提取programId，没找到则兜底
  return matchOkr?.programId || '无关联项目'
})
const getGoalIdByProgramId = computed(() => {
  // 1. 边界判断：未选择okrId 或 无okrOptions数据，直接返回空/提示
  if (!form.value.programId) {
    return '未选择项目'
  }

  // 2. 核心：找到okrId匹配的项（箭头函数简写，自动return判断条件）
  const matchOkr = programStore.programOptions.find(program => program.id === form.value.programId)
  form.value.goalId = matchOkr.goalId

  // 3. 提取programId，没找到则兜底
  return matchOkr?.goalId || '无关联目标'
})


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

    await todoStore.addTodo(form.value)
    form.value = {}
  } else {
    await todoStore.updateTodo(form.value)
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
const quitContentChange = (newContent) => {
  form.value.quitDesc = newContent
}

const finishContentChange = (newContent) => {
  form.value.finishDesc = newContent
}


// 表单校验
const rules = ref({
  name: [
    { required: true, message: '请输入Todo名称' }
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
      <el-form-item prop="name" label="Todo">
        <el-input
          label="Todo名称"
          placeholder="请Todo标题"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item prop="goalId" label="目标归属">
        <el-tag type="primary">{{ getGoalIdByProgramId }}</el-tag>
      </el-form-item>
      <el-form-item prop="programId" label="项目归属">
        <el-tag type="success">{{ getProgramIdByOkrId }}</el-tag>
      </el-form-item>

      <el-form-item prop="okrId" label="关联OKR">
        <el-select
          v-model="form.okrId"
          placeholder="选择OKR归属"
        >
          <el-option
            v-for="item in okrStore.okrOptions"
            :key="item.id"
            :value="item.id"
            :label="item.krName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="deadline" label="截止日期">
        <el-date-picker
          v-model="form.deadline"
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
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
      <el-row v-if="form.status===2">
        <p>放弃日志</p>
        <text-editor
          @contentChange="quitContentChange"
          :origin-content="form.quitDesc || '写写你为何放弃这个todo？带来了什么不好的感受？下次是否可以避免再次出现这样的情况？'" />
      </el-row>
      <el-row v-else-if="form.status===1">
        <p>完成总结</p>
        <text-editor
          @contentChange="finishContentChange"
          :origin-content="form.finishDesc || '这个todo带给你什么感受？你有什么样的收获？'" />
      </el-row>


    </el-form>
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
