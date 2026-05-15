<template>
  <div v-if="isOpen"
       class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div
      class="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] p-1">
      <!-- 模态框装饰线条 -->
      <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 -mt-1 -ml-1"></div>
      <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 -mt-1 -mr-1"></div>
      <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fuchsia-500 -mb-1 -ml-1"></div>
      <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500 -mb-1 -mr-1"></div>

      <div class="bg-slate-950 p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
        <h2 class="text-2xl font-bold text-cyan-400 mb-6 uppercase tracking-widest border-b border-slate-800 pb-2">
          {{ editMode ? '>> 修改' : '>> 新建' }}
        </h2>

        <form @submit.prevent="saveOkr" class="space-y-4">
          <!-- 第一行：标题与日期 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- OKR名称 -->
            <div class="flex flex-col">
              <label class="text-xs text-cyan-500 uppercase font-bold mb-2">OKR名称</label>
              <el-input
                v-model="okrForm.krName"
                type="text"
                placeholder="输入OKR名称..."
              />
            </div>

          </div>

          <!-- 第二行：描述 -->
          <div class="space-y-1">
            <label class="text-xs text-cyan-500 uppercase font-bold">OKR描述</label>
            <textarea v-model="okrForm.krDesc" rows="12"
                      class="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                      placeholder="详细描述OKR..."></textarea>
          </div>

          <!-- 第三行：参数设置 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] text-slate-500 uppercase">绑定项目</label>
              <el-cascader
                filterable
                clearable
                v-model="okrForm.programId"
                :options="programOptions"
                :show-all-levels="false"
                :props="{ emitPath: false }"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-slate-500 uppercase">状态</label>
              <el-select v-model="okrForm.status">
                <el-option :value="0" :label="'待开始'"></el-option>
                <el-option :value="1" :label="'完成'"></el-option>
                <el-option :value="2" :label="'放弃'"></el-option>
              </el-select>
            </div>

          </div>

          <!-- 按钮 -->
          <div class="pt-4 flex justify-end gap-4">
            <button type="button" @click="closeModal"
                    class="cursor-pointer px-6 py-2 border border-slate-600 text-slate-400 hover:text-white hover:border-white transition-colors uppercase text-sm font-bold">
              取消
            </button>
            <button
              type="submit"
              class="cursor-pointer px-6 py-2 bg-cyan-600 text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all uppercase text-sm font-black tracking-wider clip-path-slant">
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

// 定义 Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 对应数据库结构的对象
  data: {
    type: Object,
    default: () => ({})
  },
  programOptions: {
    type: Array
  }
})

// 定义 Emits
const emit = defineEmits(['update:modelValue', 'saveOkr'])
const saveOkr = async () => {
  emit('saveOkr', okrForm.value)
}
// 控制模态框显示
const isOpen = ref(props.modelValue)
const editMode = computed(() => {
  return !!props.data.id

})

// 监听 v-model 变化
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal
    console.log(newVal)
  }, {
    deep: true, immediate: true
  }
)

const okrForm = ref(props.data)
watch(
  () => props.data,
  (newVal) => {
    okrForm.value = newVal
  }, {
    deep: true
  }
)

// 关闭模态框
const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* 自定义滚动条以匹配赛博风格 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #020617;
}

::-webkit-scrollbar-thumb {
  background: #083344;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #06b6d4;
}
</style>
