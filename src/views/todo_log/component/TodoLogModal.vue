<template>
  <!-- 背景遮罩 -->
  <div v-show="props.modelValue"
       class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto">
    <!-- 模态框容器 -->
    <div

      class="relative w-full max-w-2xl m-4 border-2 border-cyan-500 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
      <!-- 装饰性角标 -->
      <div class="absolute -top-2 -left-2 w-4 h-4 bg-fuchsia-600"></div>
      <div class="absolute -bottom-2 -right-2 w-4 h-4 bg-fuchsia-600"></div>

      <!-- 头部 -->
      <div class="flex justify-between items-center p-6 border-b border-cyan-900/50 bg-cyan-950/30">
        <h2>
          {{ isEdit ? '修改' : '新增' }}日志
        </h2>
        <button @click="closeModal" class="text-cyan-500 hover:text-white transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Title -->
          <div class="col-span-2 group">
            <label
              class="block mb-2 text-xs font-mono uppercase text-fuchsia-400 tracking-wider group-focus-within:text-cyan-400 transition-colors">
              日志标题
            </label>
            <input
              v-model="formData.title"
              type="text"
              maxlength="50"
              required
              class="w-full bg-transparent border-b-2 border-slate-700 px-2 py-1 text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-300 placeholder-slate-600 font-mono"
              placeholder="输入日志标题..."
            />
          </div>

          <!-- Score -->
          <div class="group">
            <label class="block mb-2 text-xs font-mono uppercase text-fuchsia-400 tracking-wider">
              满意度评分
            </label>
            <el-rate
              show-text
              v-model="formData.score"
            />
          </div>

          <!-- Emotion -->
          <div class="group">
            <label class="block mb-2 text-xs font-mono uppercase text-fuchsia-400 tracking-wider">
              情绪 (Emotion)
            </label>
            <div class="relative">
              <select
                v-model="formData.emotion"
                class="w-full bg-slate-950/50 border border-slate-700 px-3 py-2 text-white appearance-none focus:outline-none focus:border-fuchsia-500 focus:shadow-[0_0_10px_rgba(217,70,239,0.3)] transition-all duration-300 font-mono"
              >
                <option value="" disabled>选择情绪状态</option>
                <option value="happy">Happy 😄</option>
                <option value="calm">Calm 😐</option>
                <option value="anxious">Anxious 😰</option>
                <option value="tired">Tired 😴</option>
                <option value="excited">Excited 🤩</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-fuchsia-500">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Log Description -->
          <div class="col-span-2 group">
            <label class="block mb-2 text-xs font-mono uppercase text-fuchsia-400 tracking-wider">
              日志内容
            </label>
            <textarea
              v-model="formData.logDesc"
              rows="4"
              class="w-full bg-slate-950/50 border border-slate-700 px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-300 font-mono resize-none"
              placeholder="记录这段经历的的经历与反思..."
            ></textarea>
          </div>

          <div class="col-span-2 grid grid-cols-2 gap-4 p-4 border border-dashed border-slate-800 bg-black/20">
            <div class="space-y-1">
              <label class="text-[10px] uppercase text-slate-500 font-mono">绑定用户ID</label>
              <el-input type="number" v-model="formData.userId" disabled
                        class="w-full bg-transparent border-b border-slate-700 text-xs text-slate-400 focus:border-fuchsia-500 focus:text-fuchsia-400 outline-none font-mono" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase text-slate-500 font-mono">绑定TodoID</label>
              <el-input type="number" v-model="formData.todoId" disabled
                        class="w-full bg-transparent border-b border-slate-700 text-xs text-slate-400 focus:border-fuchsia-500 focus:text-fuchsia-400 outline-none font-mono" />
            </div>

          </div>
          <div class="w-full">
            <label class="text-[10px] uppercase text-slate-500 font-mono w-full">附件上传</label>
            <uploader
              :id-params="{todoId:formData.todoId}"
            />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end pt-4 border-t border-cyan-900/50">
          <button
            type="button"
            @click="closeModal"
            class="cursor-pointer px-6 py-2 mr-4 text-sm font-mono text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            class="cursor-pointer relative px-8 py-2 font-bold text-black bg-cyan-400 uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all duration-300 transform skew-x-[-10deg] hover:skew-x-0 shadow-[4px_4px_0px_rgba(217,70,239,0.8)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.8)]"
          >
            <span class="block transform skew-x-[10deg] hover:skew-x-0">确认提交</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Uploader from '@/components/Uploader.vue'
import useUserStore from '@/stores/user.js'

// 定义 Props
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  initialData: { type: Object, default: null } // 用于编辑时传入的数据
})

// 定义 Emits
const emit = defineEmits(['update:modelValue', 'submit'])
const userStore = useUserStore()
// 表单数据状态
const formData = ref({
  id: null,
  userId: userStore.userInfo.id, // 假设默认用户
  todoId: null,
  goalId: null,
  programId: null,
  okrId: null,
  title: '',
  score: 0,
  logDesc: '',
  emotion: 'calm'
})

// 判断是否为编辑模式
const isEdit = ref(false)

// 监听 initialData 变化以填充表单
watch(() => props.initialData, (newVal) => {
  if (newVal && newVal.id) {
    isEdit.value = true
    formData.value = { ...newVal }
  } else {
    isEdit.value = false
    // 重置表单（除了默认值）
    formData.value = {
      id: null,
      userId: userStore.userInfo.id, // 假设默认用户
      todoId: newVal.todoId,
      goalId: null,
      programId: null,
      okrId: null,
      title: '',
      score: 0,
      logDesc: '',
      emotion: 'calm'
    }
  }
}, { immediate: true })

// 关闭模态框
const closeModal = () => {
  emit('update:modelValue', false)
}

// 提交表单
const handleSubmit = () => {
  // 这里可以添加表单验证逻辑
  emit('submit', formData.value)
  closeModal()
}
</script>

<style scoped>
/* 赛博朋克故障文字效果 */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(class); /* 仅用于演示，实际需通过JS或特定属性复制文本 */
  /* 注意：纯CSS实现完美的动态故障文本比较复杂，这里提供一个静态的视觉风格 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0f172a; /* 遮挡底层 */
}

/* 简单的静态故障阴影 */
h2 {
  text-shadow: 2px 0 #db2777, -2px 0 #06b6d4;
}
</style>
