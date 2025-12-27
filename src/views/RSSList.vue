<template>
  <div class="rss-container">
    <el-row :gutter="10" type="flex" class="main-row">
      <!-- 左侧面板：RSS订阅列表 + 文章列表 -->
      <el-col :xs="24" :md="8" class="left-panel">
        <!-- RSS 订阅列表 -->
        <div class="rss-section">
          <h1 class="title">📡 我的RSS订阅</h1>

          <!-- 加载中 -->
          <div v-if="loading" class="loading-msg">
            <el-icon><Loading /></el-icon> 加载中...
          </div>

          <!-- 错误提示 -->
          <el-alert
            v-if="errorMsg"
            title="出错了"
            type="error"
            :description="errorMsg"
            show-icon
            closable
            @close="errorMsg = ''"
            class="error-msg"
          />

          <!-- 订阅列表 -->
          <div v-if="subscriptions.length > 0 && !loading" class="rss-list">
            <div v-for="rss in subscriptions" :key="rss.id" class="rss-item">
              <router-link :to="`/${rss.id}/articles`" class="rss-title">{{
                rss.title
              }}</router-link>
            </div>
          </div>
          <div v-else-if="!loading && !errorMsg" class="empty-msg">
            暂无订阅
          </div>

          <!-- 分页 -->
          <el-pagination
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
import { ref, onMounted } from "vue";
import { Loading } from "@element-plus/icons-vue";

import {
  getAllSubscriptions,
  type SubscriptionItem,
} from "../api/subscription";
import { handleApiError } from "../utils/handleError";

const subscriptions = ref<SubscriptionItem[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 6;

const loading = ref(false);
const errorMsg = ref("");

const fetchSubscriptions = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    const data = await getAllSubscriptions({
      page: currentPage.value,
      pageSize: pageSize,
    });
    subscriptions.value = data.items;
    totalCount.value = data.total;
  } catch (err: any) {
    handleApiError(err);
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
