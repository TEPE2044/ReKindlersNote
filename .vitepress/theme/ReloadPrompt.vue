<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

// 更新策略 A（2026-10-19 决议）：预缓存有新版本才提示，不打断当前阅读。
// 首次安装的"可离线"提示按"不打扰"原则不显示。
const { needRefresh, updateServiceWorker } = useRegisterSW()
</script>

<template>
  <Transition name="pwa-refresh">
    <div v-if="needRefresh" class="pwa-refresh" role="status">
      <span class="pwa-refresh-text">内容已更新</span>
      <button class="pwa-refresh-action" type="button" @click="updateServiceWorker(true)">
        点此刷新
      </button>
      <button class="pwa-refresh-close" type="button" aria-label="稍后再说" @click="needRefresh = false">
        ×
      </button>
    </div>
  </Transition>
</template>
