<template>
  <div class="article-list-wrapper">
    <!-- 文章列表部分 -->
    <div class="article-list-section">
      <h2>文章列表</h2>
      <ul class="article-ul">
        <li
          v-for="(article, index) in articles"
          :key="article.id"
          :class="[
            'article-item',
            article.id.toString() === $route.params.articleId
              ? 'active'
              : '',
          ]"
        >
          <span class="article-index"
            >{{ (currentPage - 1) * pageSize + index + 1 }}.
          </span>

          <router-link
            :to="`/${$route.params.rssId}/articles/${article.id}`"
            class="article-link"
            >{{ article.title }} ({{
              article.published_at.slice(0, 10)
            }})</router-link
          >
        </li>
      </ul>

      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalCount"
        layout="prev, pager, next, total"
        @current-change="handlePageChange"
        class="pagination"
      />
    </div>

    <!-- 文章详情部分（移动端隐藏） -->
    <div class="article-detail-section">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts" name="ArticleList">
import { ref, watch } from "vue";

import { fetchArticles, type ArticleItem } from "../api/subscription";

const articles = ref<ArticleItem[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);

// 通过 props 接收 rssId
const props = defineProps({
  rssId: {
    type: String,
    required: true,
  },
});

// 请求数据函数，带分页参数
async function loadArticles(rssId: string, page: number) {
  const data = await fetchArticles({ rssId, page, pageSize: pageSize.value });
  articles.value = data.items;
  totalCount.value = data.total;
}
// 获取数据
watch(
  () => props.rssId,
  async (rssId) => {
    if (rssId) await loadArticles(rssId, currentPage.value);
  },
  { immediate: true },
);
async function handlePageChange(page: number) {
  currentPage.value = page;
  await loadArticles(props.rssId, page);
}
</script>

<style scoped>
.article-list-wrapper {
  display: flex;
  gap: 24px;
  flex-direction: column;
}

.article-list-section {
  text-align: left;
}

.article-list-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em;
  font-weight: 700;
  color: #2d3748;
  padding-bottom: 12px;
  border-bottom: 3px solid #667eea;
}

.article-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-item {
  display: flex;
  align-items: start;
  gap: 10px;
  padding: 14px 16px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.article-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  border-left-color: #667eea;
}

.article-item.active {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-left-color: #e17055;
  box-shadow: 0 4px 12px rgba(225, 112, 85, 0.2);
}

.article-index {
  color: #718096;
  flex-shrink: 0;
  font-weight: 600;
  min-width: 24px;
}

.article-link {
  color: #4a5568;
  text-decoration: none;
  flex: 1;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.2s;
}

.article-link:visited {
  color: #805ad5;
}

.article-link:hover {
  color: #667eea;
}

.pagination {
  margin-top: 20px;
}

.article-detail-section {
  flex: 1;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

/* 移动端：垂直排列，隐藏详情（通过路由切换） */
@media (max-width: 768px) {
  .article-list-wrapper {
    flex-direction: column;
  }
  
  .article-detail-section {
    display: none;
  }
  
  .article-item {
    padding: 12px 14px;
  }
  
  .article-list-section h2 {
    font-size: 1.3em;
  }
}

/* PC端：无变化，保持垂直排列在右侧面板 */
@media (min-width: 769px) {
  .article-list-wrapper {
    flex-direction: column;
  }
  
  .article-detail-section {
    display: block;
  }
}
</style>
