<script setup>

import TextEditor from '@/components/TextEditor.vue'
import Uploader from '@/components/Uploader.vue'
import { ref, defineProps, watch } from 'vue'
import useProjectStore from '@/stores/project/project.js'
import useChannelStore from '@/stores/project/projectChannel.js'
import { ElMessage } from 'element-plus'


const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  },
  projectForm: {
    type: Object,
    default: () => ({})
  }
})
// 接受传过来的数据
const form = ref({})
const deepClone = (obj) => JSON.parse(JSON.stringify(obj))
// 监听父组件传递的数据变化
watch(
  () => props.projectForm,
  (newVal) => {
    // 深拷贝新数据，强制覆盖旧数据
    form.value = deepClone(newVal)
    // 关键：确保编辑器内容同步更新（即使已有值也覆盖）
    if (form.value.projectDesc === undefined) {
      form.value.projectDesc = ''
    }
  },
  { deep: true, immediate: true } // deep+immediate 确保深度监听+初始化执行
)

const handleCancel = () => {
  emit('update:drawerVisible', false) // 通知父组件关闭抽屉
  form.value = {}
}

// project状态
const projectStore = useProjectStore()
// channel状态
const channelStore = useChannelStore()
const handleSubmit = async () => {
  if (!form.value.id) {
    const res = await projectStore.addProject(form.value)
    form.value = {}

  } else {
    await projectStore.updateProject(form.value)
    form.value = {}
  }
  // 判断是添加还是编辑
  emit('update:drawerVisible', false) // 提交后关闭抽屉
}

// emit 事件
const emit = defineEmits(['update:drawerVisible'])

// 项目选项
const statusOptions = [
  {
    status: 0,
    label: '待完成'
  },
  {
    status: 1,
    label: '已完成'
  },
  {
    status: 2,
    label: '已放弃'
  }
]
const customerOptions = []
// 项目描述监听内容更改
const handleContentChange = (newContent) => {
  form.value.projectDesc = newContent
}

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
    <el-form label-width="auto" :model="form">
      <el-form-item prop="projectName" label="项目标题">
        <el-input
          label="项目名称"
          placeholder="请输入项目标题"
          v-model="form.projectName"
        ></el-input>
      </el-form-item>
      <el-form-item prop="amount" label="项目金额">
        <el-input-number
          label="项目金额"
          placeholder="请输入此项目的报酬"
          v-model="form.amount"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="projectStack" label="技术栈">
        <el-input
          label="技术栈描述"
          placeholder="选用的技术栈"
          v-model="form.projectStack"
        ></el-input>
      </el-form-item>
      <el-form-item prop="status" label="项目状态">
        <el-select
          v-model="form.status"
          placeholder="选择项目状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.status"
            :value="item.status"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="startDate" label="开始时间">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endDate" label="截止日期">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        prop="channelId"
        label="渠道来源"
      >
        <el-select
          placeholder="选择渠道"
          filterable
          v-model="form.channelId"
        >
          <el-option
            v-for="channel in channelStore.channelOptions"
            :key="channel.id"
            :value="channel.id"
            :label="channel.channelName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="customerId"
        label="客户"
      >
        <el-select
          placeholder="选择客户|确保客户信息界面有对应信息"
          v-model="form.customerId"
          filterable
        >
          <el-option
            v-for="customer in customerOptions"
            :key="customer.id"
            :value="customer.id"
            :label="customer.customerName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="coverPath" label="项目封面图">
        <uploader />
      </el-form-item>
      <el-form-item prop="attachmentPath" label="项目附件列表">
        <uploader />
      </el-form-item>
      <el-divider></el-divider>
    </el-form>
    <p>项目描述</p>
    <text-editor
      @contentChange="handleContentChange"

      :origin-content="form.projectDesc || ''" />
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
