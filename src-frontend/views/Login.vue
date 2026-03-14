<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { api, ApiError } from '@/services/api'
import { Lock, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const toast = useToastStore()

const accessKey = ref('')
const loading = ref(false)

// 检查 URL 参数
if (route.query.key) {
  sessionStorage.setItem('auth', 'true')
  sessionStorage.setItem('accessKey', route.query.key)
  router.replace('/')
}

async function handleLogin() {
  if (!accessKey.value) {
    toast.error('请输入访问密钥')
    return
  }
  
  loading.value = true
  
  // 保存密钥，让后端验证
  sessionStorage.setItem('accessKey', accessKey.value)
  
  try {
    // 尝试获取域名列表验证密钥
    await api.getDomains()
    sessionStorage.setItem('auth', 'true')
    router.push('/')
  } catch (e) {
    sessionStorage.removeItem('accessKey')
    if (e instanceof ApiError && e.status === 401) {
      toast.error('访问密钥错误')
    } else {
      toast.error('验证失败，请重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- 卡片 -->
      <div class="relative">
        <!-- 顶部光效 -->
        <div class="absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
        
        <div class="card p-10">
          <!-- 图标 -->
          <div class="flex justify-center mb-8">
            <div class="relative">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center glow">
                <Lock class="w-9 h-9 text-white" />
              </div>
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 blur-xl opacity-40 animate-pulse-slow" />
            </div>
          </div>
          
          <!-- 标题 -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">
                      <span class="text-gradient">DriftMail</span>
                    </h1>
                    <p class="text-dark-400 text-sm">临时邮箱，随用随弃</p>          </div>
          
          <!-- 表单 -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <div class="relative">
              <input
                v-model="accessKey"
                type="password"
                class="input pl-12"
                placeholder="输入访问密钥"
                autocomplete="off"
              >
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
                <Lock class="w-5 h-5" />
              </div>
            </div>
            
            <button
              type="submit"
              class="btn-primary w-full py-3.5 text-base"
              :disabled="loading"
            >
              <template v-if="loading">
                <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>验证中...</span>
              </template>
              <template v-else>
                <span>进入邮箱</span>
                <ArrowRight class="w-5 h-5" />
              </template>
            </button>
          </form>
          
          <!-- 提示 -->
          <div class="mt-8 pt-6 border-t border-white/5 text-center">
            <p class="text-dark-500 text-xs leading-relaxed">
              将密钥添加到 URL 可自动登录<br>
              <code class="px-2 py-0.5 rounded bg-dark-800 text-dark-400 font-mono text-xs">?key=你的密钥</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
