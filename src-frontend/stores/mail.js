import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMailStore = defineStore('mail', () => {
  // 状态
  const token = ref(localStorage.getItem('tm_token') || null)
  const email = ref(localStorage.getItem('tm_email') || null)
  const emailId = ref(localStorage.getItem('tm_emailId') || null)
  const expiresAt = ref(localStorage.getItem('tm_expiresAt') || null)
  const domains = ref([])
  const mails = ref([])
  const currentMail = ref(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!email.value)
  
  const remainingTime = computed(() => {
    if (!expiresAt.value) return 0
    const diff = new Date(expiresAt.value) - new Date()
    return Math.max(0, diff)
  })

  const isExpired = computed(() => remainingTime.value <= 0)

  const unreadCount = computed(() => mails.value.filter(m => !m.seen).length)

  // 方法
  function setSession(data) {
    token.value = data.token
    email.value = data.address
    emailId.value = data.id
    expiresAt.value = data.expiresAt
    
    localStorage.setItem('tm_token', data.token)
    localStorage.setItem('tm_email', data.address)
    localStorage.setItem('tm_emailId', data.id)
    localStorage.setItem('tm_expiresAt', data.expiresAt)
  }

  function clearSession() {
    token.value = null
    email.value = null
    emailId.value = null
    expiresAt.value = null
    mails.value = []
    currentMail.value = null
    
    localStorage.removeItem('tm_token')
    localStorage.removeItem('tm_email')
    localStorage.removeItem('tm_emailId')
    localStorage.removeItem('tm_expiresAt')
  }

  function setMails(data) {
    mails.value = data
  }

  function setCurrentMail(mail) {
    currentMail.value = mail
  }

  function setDomains(data) {
    domains.value = data
  }

  function setLoading(value) {
    loading.value = value
  }

  function extendExpiry(minutes = 30) {
    const newExpiresAt = new Date(Date.now() + minutes * 60 * 1000).toISOString()
    expiresAt.value = newExpiresAt
    localStorage.setItem('tm_expiresAt', newExpiresAt)
  }

  return {
    // 状态
    token,
    email,
    emailId,
    expiresAt,
    domains,
    mails,
    currentMail,
    loading,
    
    // 计算属性
    isAuthenticated,
    remainingTime,
    isExpired,
    unreadCount,
    
    // 方法
    setSession,
    clearSession,
    setMails,
    setCurrentMail,
    setDomains,
    setLoading,
    extendExpiry,
  }
})
