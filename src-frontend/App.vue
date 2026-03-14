<script setup>
import { RouterView } from 'vue-router'
import BackgroundEffects from '@/components/BackgroundEffects.vue'
import ToastContainer from '@/components/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-dark-950 relative overflow-hidden">
    <!-- 背景 -->
    <BackgroundEffects />
    
    <!-- 主内容 -->
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
    
    <!-- Toast -->
    <ToastContainer />
  </div>
</template>
