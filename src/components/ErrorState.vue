<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button v-if="showRetry" @click="$emit('retry')" class="retry-btn">
      <span class="btn-icon">🔄</span>
      重新加载
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '加载失败'
  },
  message: {
    type: String,
    default: '请稍后重试'
  },
  showRetry: {
    type: Boolean,
    default: true
  }
});

defineEmits(['retry']);
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.8;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.error-title {
  font-size: 1.5em;
  font-weight: 600;
  color: #e53e3e;
  margin: 0 0 12px 0;
}

.error-message {
  font-size: 0.95em;
  color: #718096;
  margin: 0 0 24px 0;
  max-width: 400px;
  line-height: 1.6;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.retry-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.1em;
  display: inline-block;
  animation: rotate 1s linear infinite paused;
}

.retry-btn:hover .btn-icon {
  animation-play-state: running;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 夜间模式 */
:deep(.dark) .error-title {
  color: #fc8181;
}

:deep(.dark) .error-message {
  color: #a0aec0;
}
</style>
