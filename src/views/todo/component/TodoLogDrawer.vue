<script setup>

import TextEditor from '@/components/TextEditor.vue'
import Uploader from '@/components/Uploader.vue'
import { ref, defineProps, watch, onMounted, computed, onBeforeMount } from 'vue'
import useTodoLogStore from '@/stores/todo/todoLog.js'
import useOkrStore from '@/stores/okr/okr.js'
import useGoalStore from '@/stores/goal/goal.js'
import useProgramStore from '@/stores/program/program.js'
import useTodoStore from '@/stores/todo/todo.js'
import { Upload } from '@icon-park/vue-next'
import { ElMessageBox } from 'element-plus'

const todoLogStore = useTodoLogStore()
const okrStore = useOkrStore()
const goalStore = useGoalStore()
const programStore = useProgramStore()
const todoStore = useTodoStore()

const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  todoId: null
})

// 接受传过来的数据
const form = ref({})
const formRef = ref(null)
const localTodoId = ref(null)
const todoLogRecord = ref([])
const logDialogVisible = ref(false)
const editLogForm = ref({})


watch(
  () => props.todoId,
  async (newVal) => {
    // 深拷贝新数据，强制覆盖旧数据
    localTodoId.value = newVal
    form.value.todoId = localTodoId.value
    await fetchTodoLogRecord()
  },
  { deep: true, immediate: true } // deep+immediate 确保深度监听+初始化执行
)


// 提交按钮触发事件
const handleSubmit = async () => {
  if (!form.value.id) {
    await todoLogStore.addTodoLog(form.value)
    await fetchTodoLogRecord()
  } else {
    await todoLogStore.updateTodoLog(form.value)
  }
  // 判断是添加还是编辑
  emit('update:drawerVisible', false) // 提交后关闭抽屉
}
const handleCancel = () => {
  emit('update:drawerVisible', false) // 通知父组件关闭抽屉
}
onBeforeMount(async () => {
  await okrStore.getOkrList()
  await programStore.getProgramList()
  await goalStore.getGoalList()
  await todoStore.getTodoList({})
})
const fetchTodoLogRecord = async () => {
  todoLogRecord.value = await todoLogStore.getTodoLogList({
    todoId: form.value.todoId
  })
}
// emit 事件
const emit = defineEmits(['update:drawerVisible'])
// 监听内容更改
const contentChange = (newContent) => {
  form.value.logDesc = newContent
}
//查看日志详情
const openLogDetailDialog = (logItem) => {
  logDialogVisible.value = true
  editLogForm.value = logItem
}
//编辑日志的文本框发生变化触发事件
const editLogDescChange = (newContent) => {
  editLogForm.value.logDesc = newContent
}


// todoLog增删改查。
const delLog = async (logId) => {
  await todoLogStore.delTodoLog(logId)
  logDialogVisible.value = false
  await fetchTodoLogRecord()
}
const editLog = async (logForm) => {
  await todoLogStore.updateTodoLog(logForm)
  logDialogVisible.value = false
  await fetchTodoLogRecord()
}
// 计算属性
const getProgramIdByOkrId = computed(() => {
  // 1. 边界判断：未选择okrId 或 无okrOptions数据，直接返回空/提示
  if (!form.value.okrId) {
    return '未选择OKR'
  }

  // 2. 核心：找到okrId匹配的项（箭头函数简写，自动return判断条件）
  const matchOkr = okrStore.okrOptions.find(okr => okr.id === form.value.okrId)
  form.value.programId = matchOkr.programId
  const matchProgram = programStore.programOptions.find(program => program.id = form.value.programId)

  // 3. 提取programId，没找到则兜底
  return matchProgram?.programName || '无关联项目'
})
const getGoalIdByProgramId = computed(() => {
  if (!form.value.programId) {
    return '未选择项目'
  }

  const matchOkr = programStore.programOptions.find(program => program.id === form.value.programId)
  form.value.goalId = matchOkr.goalId
  const matchGoal = goalStore.goalOptions.find(goal => goal.id === form.value.goalId)
  // 3. 提取programId，没找到则兜底
  return matchGoal?.goalName || '无关联目标'
})
const getOkrIdByTodoId = computed(() => {
  if (!form.value.todoId) {
    return '未选择项目'
  }

  // 2. 核心：找到okrId匹配的项（箭头函数简写，自动return判断条件）
  const match = todoStore.todoOptions?.find(todo => todo.id === form.value.todoId)
  form.value.okrId = match.okrId
  const matchOkr = okrStore.okrOptions.find(okr => okr.id === form.value.okrId)
  // 3. 提取programId，没找到则兜底
  return matchOkr?.krName || '无关联OKR'
})
const getTodoIdByLogId = computed(() => {
  console.log(localTodoId)
  if (!localTodoId.value) {
    return '未关联到此todo'
  }

  // 2. 核心：找到okrId匹配的项（箭头函数简写，自动return判断条件）
  const matchOkr = todoStore.todoOptions.find(todo => todo.id === form.value.todoId)

  // 3. 提取programId，没找到则兜底
  return matchOkr?.name || '无关联todo'
})

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
    title="todo日志"
  >
    <el-form
      label-width="auto"
      :model="form"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item prop="title" label="日志标题">
        <el-input
          label="日志标题"
          placeholder="请输入日志标题"
          v-model="form.title"
        ></el-input>
      </el-form-item>
      <el-form-item prop="goalId" label="关联目标">
        <el-tag type="success">{{ getGoalIdByProgramId }}</el-tag>
      </el-form-item>
      <el-form-item prop="programId" label="关联项目">
        <el-tag type="success">{{ getProgramIdByOkrId }}</el-tag>
      </el-form-item>
      <el-form-item prop="okrId" label="关联OKR">
        <el-tag type="success">{{ getOkrIdByTodoId }}</el-tag>
      </el-form-item>
      <el-form-item prop="todoId" label="关联todo任务">
        <el-tag type="primary">{{ getTodoIdByLogId }}</el-tag>
      </el-form-item>
      <el-form-item prop="score" label="满意度评分">
        <el-rate v-model="form.score"></el-rate>
      </el-form-item>

      <el-divider></el-divider>
      <p>日志记录</p>
      <div v-if="todoLogRecord.length>0" style="margin:0 auto">
        <el-steps style="max-width: 600px" align-center>
          <el-step
            @click="openLogDetailDialog(log)"
            class="step"
            v-for="log in todoLogRecord"
            :key="log.id"
            :title="log.title"
            :description="log.createTime"
          />
        </el-steps>
      </div>
      <el-row v-else>
        <el-empty description="暂无日志记录" style="margin: 0 auto;"></el-empty>
      </el-row>

      <el-divider></el-divider>
      <el-row>
        <p>日志总结</p>
        <el-alert type="success"
                  :closable="false"
                  description="本次专注情况如何？感受如何？是否遇到什么问题比较关注的？获得了什么新的思考？"></el-alert>
        <text-editor
          @contentChange="contentChange"
          :origin-content="form.logDesc || ''" />
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

  <el-dialog
    v-model="logDialogVisible"
    title="日志信息"
    width="500"
  >
    <el-form v-model="editLogForm" label-width="auto">
      <el-form-item prop="createTime" label="创建时间">
        <el-input v-model="editLogForm.createTime" disabled></el-input>
      </el-form-item>
      <el-form-item prop="updateTime" label="更新时间">
        <el-input v-model="editLogForm.updateTime" disabled></el-input>
      </el-form-item>
      <el-form-item prop="title" label="日志标题">
        <el-input v-model="editLogForm.title"></el-input>
      </el-form-item>
      <el-form-item>
        <p>日志描述</p>
        <text-editor
          @content-change="editLogDescChange"
          :origin-content="editLogForm.logDesc || ''"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="warning"
        @click="editLog(editLogForm)"
      >提交
      </el-button>
      <el-button
        type="danger"
        @click="delLog(editLogForm.id)"
      >删除
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 给整个步骤项添加pointer鼠标效果（核心） */
.step {
  cursor: pointer; /* 鼠标悬浮显示手型 */
  margin-bottom: 20px; /* 保留你之前的间距样式 */
}

/* 可选：悬浮时标题变色，增强交互反馈 */
.step :deep(.el-step__title) {
  font-size: 14px;
  color: #333;
  transition: color 0.2s; /* 过渡动画更丝滑 */
}

.step:hover :deep(.el-step__title) {
  color: #409eff; /* 悬浮时标题变蓝色 */
}

/* 步骤描述样式 */
.step :deep(.el-step__description) {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 步骤图标样式（可选） */
.step :deep(.el-step__icon) {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>
