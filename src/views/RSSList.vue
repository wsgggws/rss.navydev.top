<template>
  <div class="rss-container">
    <!-- 主题切换按钮 -->
    <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到深色模式'">
      {{ isDark ? '🌙' : '☀️' }}
    </button>
    
    <el-row :gutter="10" type="flex" class="main-row">
      <!-- 左侧面板：RSS订阅列表 + 文章列表 -->
      <el-col :xs="24" :md="8" class="left-panel">
        <!-- RSS 订阅列表 -->
        <div class="rss-section">
          <h1 class="title">📡 我的RSS订阅</h1>

          <!-- 搜索框 -->
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索订阅..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>

          <!-- 加载中 -->
          <SkeletonLoader v-if="loading" type="rss-list" :count="pageSize" />

          <!-- 错误状态 -->
          <ErrorState
            v-else-if="errorMsg"
            :message="errorMsg"
            @retry="fetchSubscriptions"
          />

          <!-- 订阅列表 -->
          <div v-else-if="filteredSubscriptions.length > 0" class="rss-list">
            <div 
              v-for="rss in filteredSubscriptions" 
              :key="rss.id" 
              :class="['rss-item', rss.id.toString() === $route.params.rssId ? 'active' : '']"
            >
              <router-link :to="`/${rss.id}/articles`" class="rss-title">{{
                rss.title
              }}</router-link>
            </div>
          </div>
          
          <!-- 空状态 -->
          <EmptyState
            v-else
            icon="📡"
            title="暂无订阅"
            :description="searchQuery ? '没有找到相关订阅' : '开始添加你的第一个RSS订阅吧'"
          />

          <!-- 分页 -->
          <el-pagination
            v-if="!searchQuery && totalCount > pageSize"
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalCount"
            layout="prev, pager, next, total"
            @current-change="fetchSubscriptions"
            class="pagination"
          />
        </div>

        <!-- 文章列表区域 -->
        <router-view name="articleList" />
      </el-col>

      <!-- 右侧面板：文章详情（独占） -->
      <el-col :xs="24" :md="16" class="right-panel">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="RSSList">
import { ref, onMounted, computed } from "vue";
import SkeletonLoader from "../components/SkeletonLoader.vue";
import EmptyState from "../components/EmptyState.vue";
import ErrorState from "../components/ErrorState.vue";
import { useDarkMode } from "../composables/useDarkMode";
import { cacheManager } from "../utils/cache";

import {
  getAllSubscriptions,
  type SubscriptionItem,
} from "../api/subscription";

const { isDark, toggleTheme } = useDarkMode();

const subscriptions = ref<SubscriptionItem[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 6;
const searchQuery = ref("");

const loading = ref(false);
const errorMsg = ref("");

// 搜索过滤
const filteredSubscriptions = computed(() => {
  if (!searchQuery.value.trim()) {
    return subscriptions.value;
  }
  const query = searchQuery.value.toLowerCase();
  return subscriptions.value.filter(sub => 
    sub.title.toLowerCase().includes(query)
  );
});

const fetchSubscriptions = async () => {
  loading.value = true;
  errorMsg.value = "";
  
  // 尝试从缓存读取
  const cacheKey = `subscriptions_page_${currentPage.value}`;
  const cached = cacheManager.get<{items: SubscriptionItem[], total: number}>(cacheKey);
  
  if (cached) {
    subscriptions.value = cached.items;
    totalCount.value = cached.total;
    loading.value = false;
    return;
  }
  
  try {
    const data = await getAllSubscriptions({
      page: currentPage.value,
      pageSize: pageSize,
    });
    subscriptions.value = data.items;
    totalCount.value = data.total;
    
    // 缓存数据
    cacheManager.set(cacheKey, data, 3 * 60 * 1000); // 3分钟
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.detail || err?.message || "加载失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSubscriptions();
});
</script>

<style scoped>
.rss-container {
  position: relative;
  min-height: 100vh;
}

/* 主题切换按钮 */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

/* 搜索框 */
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  opacity: 0.6;
}

.main-row {
  align-items: flex-start;
}

.title {
  font-size: 1.8em;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.left-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  position: sticky;
  top: 20px;
}

.left-panel::-webkit-scrollbar {
  width: 8px;
}

.left-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.left-panel::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.left-panel::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.right-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 20px;
  min-height: calc(100vh - 40px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rss-section {
  margin-bottom: 0;
}

.loading-msg,
.empty-msg {
  text-align: center;
  color: #718096;
  margin-top: 20px;
}

.error-msg {
  margin-top: 20px;
}

.rss-list {
  margin-top: 20px;
}

.pagination {
  margin-top: 24px;
}

.rss-item {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.rss-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #e0e7ff 0%, #b8c5e0 100%);
}

.rss-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.rss-item.active .rss-title {
  color: #ffffff;
  font-weight: 700;
}

.rss-item.active .rss-title:hover {
  color: #f0f0f0;
}

.rss-title {
  display: block;
  color: #2d3748;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.rss-title:hover {
  color: #667eea;
}

/* 夜间模式 */
:deep(.dark) .search-input {
  background: rgba(45, 55, 72, 0.9);
  color: #e2e8f0;
  border-color: transparent;
}

:deep(.dark) .search-input:focus {
  background: #2d3748;
  border-color: #667eea;
}

:deep(.dark) .left-panel,
:deep(.dark) .right-panel {
  background: rgba(26, 32, 44, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

:deep(.dark) .rss-item {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
}

:deep(.dark) .rss-item:hover {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

:deep(.dark) .rss-title {
  color: #e2e8f0;
}

:deep(.dark) .rss-title:hover {
  color: #a5b4fc;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .left-panel {
    padding: 10px 6px;
    margin-bottom: 6px;
    border-radius: 8px;
    max-height: none;
    position: relative;
    top: 0;
  }
  
  .right-panel {
    padding: 10px 6px;
    margin-bottom: 6px;
    border-radius: 8px;
    min-height: auto;
  }
  
  .rss-item {
    padding: 10px 12px;
  }
  
  .title {
    font-size: 1.5em;
  }
}
</style>
