<template>
  <div class="article-list-container">
    <h2 class="article-list-title">📰 文章列表</h2>
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
</template>

<script setup lang="ts" name="ArticleList">
import { ref, watch } from "vue";

import { fetchArticles, type ArticleItem } from "../api/subscription";

const articles = ref<ArticleItem[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = ref(6);

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
.article-list-container {
  margin-top: 30px;
  padding-top: 24px;
  border-top: 2px solid rgba(102, 126, 234, 0.2);
}

.article-list-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em;
  font-weight: 700;
  color: #2d3748;
  text-align: left;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 500px;
  overflow-y: auto;
}

.article-ul::-webkit-scrollbar {
  width: 6px;
}

.article-ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.article-ul::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 3px;
}

.article-ul::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

.article-item {
  display: flex;
  align-items: start;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
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
  font-size: 0.95em;
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

/* 移动端优化 */
@media (max-width: 768px) {
  .article-list-container {
    margin-top: 20px;
    padding-top: 16px;
  }
  
  .article-list-title {
    font-size: 1.3em;
  }
  
  .article-ul {
    max-height: 400px;
  }
  
  .article-item {
    padding: 10px 12px;
  }
}
</style>
