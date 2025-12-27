<template>
  <div class="skeleton-container">
    <!-- RSS订阅列表骨架屏 -->
    <div v-if="type === 'rss-list'" class="skeleton-rss-list">
      <div v-for="i in count" :key="i" class="skeleton-rss-item">
        <div class="skeleton-line skeleton-title"></div>
      </div>
    </div>

    <!-- 文章列表骨架屏 -->
    <div v-else-if="type === 'article-list'" class="skeleton-article-list">
      <div class="skeleton-header"></div>
      <div v-for="i in count" :key="i" class="skeleton-article-item">
        <div class="skeleton-circle"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-date"></div>
        </div>
      </div>
    </div>

    <!-- 文章详情骨架屏 -->
    <div v-else-if="type === 'article-detail'" class="skeleton-article-detail">
      <div class="skeleton-line skeleton-title-large"></div>
      <div class="skeleton-meta">
        <div class="skeleton-line skeleton-meta-item"></div>
        <div class="skeleton-line skeleton-meta-item"></div>
      </div>
      <div class="skeleton-content-area">
        <div v-for="i in 8" :key="i" class="skeleton-line skeleton-paragraph"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'rss-list',
    validator: (value: string) => ['rss-list', 'article-list', 'article-detail'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  }
});
</script>

<style scoped>
.skeleton-container {
  width: 100%;
}

/* 骨架屏基础动画 */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.skeleton-line,
.skeleton-circle {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 468px 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: 8px;
}

/* RSS列表骨架屏 */
.skeleton-rss-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-rss-item {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.skeleton-title {
  height: 20px;
  width: 80%;
}

/* 文章列表骨架屏 */
.skeleton-article-list {
  margin-top: 30px;
}

.skeleton-header {
  height: 32px;
  width: 150px;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 468px 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: 8px;
}

.skeleton-article-item {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.skeleton-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-date {
  height: 14px;
  width: 60%;
}

/* 文章详情骨架屏 */
.skeleton-article-detail {
  padding: 20px 0;
}

.skeleton-title-large {
  height: 40px;
  width: 90%;
  margin-bottom: 24px;
}

.skeleton-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.skeleton-meta-item {
  height: 16px;
  width: 100px;
}

.skeleton-content-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-paragraph {
  height: 16px;
  width: 100%;
}

.skeleton-paragraph:nth-child(3n) {
  width: 85%;
}

.skeleton-paragraph:nth-child(5n) {
  width: 75%;
}

/* 夜间模式 */
:deep(.dark) .skeleton-line,
:deep(.dark) .skeleton-circle {
  background: linear-gradient(90deg, #2d3748 25%, #1a202c 50%, #2d3748 75%);
  background-size: 468px 100%;
}

:deep(.dark) .skeleton-rss-item,
:deep(.dark) .skeleton-article-item {
  background: rgba(0, 0, 0, 0.2);
}
</style>
