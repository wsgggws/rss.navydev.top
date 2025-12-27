<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: '📭'
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 1.5em;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 0.95em;
  color: #718096;
  margin: 0 0 24px 0;
  max-width: 400px;
  line-height: 1.6;
}

/* 夜间模式 */
:deep(.dark) .empty-title {
  color: #e2e8f0;
}

:deep(.dark) .empty-description {
  color: #a0aec0;
}
</style>
