<template>
  <!-- 遮罩层 -->
  <transition firstCateName="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      @click.self="close"
    >
      <!-- 模态框主体 -->
      <div
        class="relative w-full max-w-lg overflow-hidden rounded-sm border border-cyan-500/30 bg-slate-900 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]"
      >
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500"></div>

        <!-- 头部 -->
        <div class="flex items-center justify-between border-b border-cyan-500/20 bg-slate-900/50 px-6 py-4">
          <h3 class="text-xl font-bold uppercase tracking-widest text-cyan-400 font-mono">
            <span class="text-fuchsia-500 mr-2">/</span>
            {{ isEdit ? '编辑' : '新增' }}
          </h3>
          <button @click="close" class="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 内容区域 -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- 金额输入 -->
          <div class="group">
            <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-fuchsia-400">金额￥</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/70 font-mono">$</span>
              <input
                v-model="formData.amount"
                type="number"
                step="0.01"
                required
                class="w-full rounded-none border border-cyan-500/30 bg-slate-950/50 py-2 pl-8 pr-4 text-white placeholder-slate-600 outline-none transition-all focus:border-fuchsia-500 focus:shadow-[0_0_15px_rgba(217,70,239,0.3)] font-mono"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- 日期与分类 -->
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <!-- 日期 -->
            <div class="group">
              <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-fuchsia-400">日期</label>
              <el-date-picker
                v-model="formData.incomeDate"
                value-format="YYYY-MM-DD"
                type="date"
              />
            </div>

            <!-- 一级分类 -->
            <div class="group">
              <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-fuchsia-400">一级分类</label>
              <el-select
                filterable
                clearable
                v-model="formData.firstCateId"
                placeholder="选择一级分类"
              >
                <el-option v-for="cat in firstCates" :key="cat.id" :value="cat.id"
                           :label="cat.firstCateName"></el-option>
              </el-select>
            </div>
          </div>

          <!-- 二级分类 -->
          <div class="group" v-show="formData.firstCateId">
            <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-fuchsia-400">二级分类</label>
            <el-select
              v-model="formData.secondCateId"
              placeholder="选择二级分类"
            >
              <el-option
                v-for="cat in secondCates"
                :key="cat.id"
                :value="cat.id"
                :label="cat.secondCateName"></el-option>
            </el-select>
          </div>
          <!--关联OKR（可选）-->
          <div class="group">
            <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-fuchsia-400">关联OKR</label>
            <el-cascader
              style="width: 100%"
              clearable
              filterable
              placeholder="关联OKR费用"
              :options="okrOptions"
              v-model="formData.okrId"
              :props="{ emitPath: false }"
            >
            </el-cascader>
          </div>


          <!-- 备注 -->
          <div class="group">
            <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-fuchsia-400">备注</label>
            <textarea
              v-model="formData.note"
              rows="3"
              class="w-full rounded-none border border-cyan-500/30 bg-slate-950/50 py-2 px-4 text-white placeholder-slate-600 outline-none transition-all focus:border-fuchsia-500 focus:shadow-[0_0_15px_rgba(217,70,239,0.3)] resize-none"
              placeholder="输入交易详情..."
            ></textarea>
          </div>
          <!--对应图片-->
          <div class="group">
            <label class="mb-1 block text-xs font-bold uppercase tracking-wider text-fuchsia-400">图片附件</label>
            <uploader

              @list-change='handleImageListChange'
            />
          </div>

          <!-- 底部按钮 -->
          <div class="mt-8 flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="close"
              class="cursor-pointer group relative overflow-hidden rounded-none border border-slate-600 px-6 py-2 text-sm font-bold uppercase tracking-wider text-slate-400 transition-all hover:border-white hover:text-white"
            >
              <span class="relative z-10">取消</span>
            </button>

            <button
              type="submit"
              class="cursor-pointer group relative overflow-hidden rounded-none bg-cyan-600 px-8 py-2 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
            >
              <!-- 装饰斜线 -->
              <div
                class="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out"></div>
              <span class="relative z-10">{{ isEdit ? '更新' : '确认录入' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import useIncomeStore from '@/stores/finance/income.js'
import Uploader from '@/components/Uploader.vue'
import { dayjs } from 'element-plus'
import useOkrStore from '@/stores/okr/okr.js'
import addWeb from '@icon-park/vue-next/lib/icons/AddWeb.js'
import useExpenseStore from '@/stores/finance/expense.js'


// Props 定义
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 编辑时传入的数据对象，如果是新增则为 null
  financeData: {
    type: Object,
    default: null
  },
  firstCateList: {
    type: Array,
    default: () => []
  },
  financeType: {
    type: String,
    default: 'income'
  }
})
const incomeStore = useIncomeStore()
const expenseStore = useExpenseStore()

// 模拟分类数据
const firstCates = ref([])
const secondCates = ref([])
// 表单数据
const formData = ref({
  id: null,
  userId: null,
  okrId: null,
  firstCateId: null,
  secondCateId: null,
  amount: '',
  incomeDate: '',
  note: ''
})

// 判断是否为编辑模式
const isEdit = computed(() => {
  return !!props.financeData.id
})
// 监听 financeData 变化，填充表单
watch(
  () => props.financeData,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    } else {
      // 重置表单
      formData.value = {
        id: null,
        userId: 1,
        firstCateId: firstCates.value[0]?.id || null,
        secondCateId: null,
        amount: '',
        incomeDate: '',
        note: ''
      }
      formData.value.incomeDate = dayjs().format('YYYY-MM-DD')
      firstCates.value = incomeStore.firstCateOptions
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => props.firstCateList,
  async (newVal) => {
    firstCates.value = newVal
  },
  { immediate: true, deep: true }
)
watch(
  () => formData.value.firstCateId,
  async (newVal) => {
    if (newVal) {
      console.log(props.financeType)
      if (props.financeType === 'expense') {
        secondCates.value = await expenseStore.getSecondCateListByFirst(newVal)
      } else {
        secondCates.value = await incomeStore.getSecondCateListByFirst(newVal)
      }
    }
  },
  { deep: true }
)
const emit = defineEmits(['submit', 'update:modelValue'])
// 关闭模态框
const close = () => {
  emit('update:modelValue', false)
}

// 提交表单
const handleSubmit = () => {
  // 这里可以做最后的数据清洗
  const payload = { ...formData.value }
  emit('submit', payload)
  close()
}

const okrStore = useOkrStore()
const okrOptions = ref()
onMounted(async () => {
  const res = await okrStore.getOptions()
  okrOptions.value = res.data.data
})


// 图片列表变化触发事件
const handleImageListChange = async (newVal) => {
  formData.value.imageList = newVal
}
</script>

<style scoped>
/* 自定义过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 去除 number 输入框的默认箭头 (可选) */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
