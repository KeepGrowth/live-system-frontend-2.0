<template>
  <!-- 模态框背景遮罩 -->
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click="handleClose"
      >
        <!-- 模态框主体 -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="scale-95 opacity-0 translate-y-4"
          enter-to-class="scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="scale-100 opacity-100 translate-y-0"
          leave-to-class="scale-95 opacity-0 translate-y-4"
        >
          <div
            v-if="modelValue"
            class="relative w-full max-w-md p-1 rounded-lg"
            @click.stop
          >
            <!-- 赛博朋克霓虹边框光晕 -->
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-lg blur opacity-75 animate-pulse"></div>

            <!-- 内容区域 -->
            <div class="relative bg-gray-900 rounded-lg p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <!-- 装饰性边角 -->
              <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 -mt-1 -ml-1"></div>
              <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 -mt-1 -mr-1"></div>
              <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fuchsia-500 -mb-1 -ml-1"></div>
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500 -mb-1 -mr-1"></div>

              <!-- 标题 -->
              <div class="flex justify-between items-center mb-6">
                <h3
                  class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  修改密码
                </h3>
                <button @click="handleClose" class="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- 表单区域 -->
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <div v-for="(field, index) in fields" :key="index">
                  <label class="block text-cyan-300 text-xs uppercase tracking-wider mb-2 font-semibold">{{ field.label
                    }}</label>
                  <div class="relative group">
                    <input
                      :type="field.type"
                      v-model="form[field.model]"
                      :placeholder="field.placeholder"
                      class="w-full bg-gray-800/50 border border-gray-700 text-gray-100 text-sm rounded p-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 placeholder-gray-600 group-hover:border-cyan-500/50"
                      required
                    />
                    <!-- 输入框聚焦时的霓虹底线 -->
                    <div
                      class="absolute bottom-0 left-0 h-0.5 bg-cyan-500 w-0 group-focus-within:w-full transition-all duration-500"></div>
                  </div>
                </div>

                <!-- 错误提示 -->
                <div v-if="errorMessage" class="text-red-400 text-xs mt-2 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ errorMessage }}
                </div>

                <!-- 按钮组 -->
                <div class="pt-4 flex gap-4">
                  <button
                    type="button"
                    @click="handleClose"
                    class="cursor-pointer flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded border border-gray-600 hover:border-gray-500 transition-all duration-300"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="cursor-pointer flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.7)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                  >
                    {{ isLoading ? '处理中...' : '确认修改' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

// 表单数据
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

// 定义输入框配置
const fields = [
  { label: '旧密码', model: 'oldPassword', type: 'password', placeholder: '输入当前密码' },
  { label: '新密码', model: 'newPassword', type: 'password', placeholder: '输入新密码' },
  { label: '确认新密码', model: 'confirmPassword', type: 'password', placeholder: '再次输入新密码' }
]

// 关闭模态框并重置表单
const handleClose = () => {
  if (isLoading.value) return
  emit('update:modelValue', false)
  resetForm()
}

// 重置表单和错误信息
const resetForm = () => {
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  errorMessage.value = ''
}

// 提交表单
const handleSubmit = async () => {
  errorMessage.value = ''

  // 基础校验
  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = '两次输入的新密码不一致'
    return
  }
  if (form.newPassword.length < 6) {
    errorMessage.value = '新密码长度不能少于6位'
    return
  }

  isLoading.value = true
  try {
    // 向父组件发送提交事件，携带表单数据
    await emit('submit', form)
    // 提交成功后关闭弹窗（也可以在父组件处理成功后再关闭）
    handleClose()
  } catch (error) {
    errorMessage.value = error.message || '修改失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 监听弹窗打开，重置状态
watch(() => props.modelValue, (val) => {
  if (val) {
    resetForm()
  }
})
</script>
