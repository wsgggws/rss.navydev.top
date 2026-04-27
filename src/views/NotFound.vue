<template>
  <div class="not-found">
    <div class="not-found-icon">🧭</div>
    <h2 class="not-found-title">404</h2>
    <p class="not-found-message">页面不存在</p>
    <p class="not-found-hint">请检查 URL 或返回首页</p>
    <button @click="goHome" class="home-btn">
      <span class="btn-icon">🏠</span>
      返回首页
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 60vh;
}

.not-found-icon {
  font-size: 80px;
  margin-bottom: 16px;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.not-found-title {
  font-size: 4em;
  font-weight: 800;
  color: #667eea;
  margin: 0 0 8px 0;
  letter-spacing: 4px;
}

.not-found-message {
  font-size: 1.2em;
  color: #4a5568;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.not-found-hint {
  font-size: 0.9em;
  color: #718096;
  margin: 0 0 32px 0;
}

.home-btn {
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

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.home-btn:active {
  transform: translateY(0);
}

/* 夜间模式 */
:deep(.dark) .not-found-message {
  color: #e2e8f0;
}

:deep(.dark) .not-found-hint {
  color: #a0aec0;
}
</style>