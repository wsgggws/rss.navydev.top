<template>
  <el-row :gutter="8" type="flex" class="article-layout">
    <el-col :xs="24" :md="10" class="article-list">
      <h2>文章列表</h2>
      <ul class="pl-0">
        <li
          v-for="(article, index) in articles"
          :key="article.id"
          :class="[
            'flex items-start gap-1',
            article.id.toString() === $route.params.articleId
              ? 'bg-yellow-300'
              : '',
          ]"
        >
          <span class="text-gray-500"
            >{{ (currentPage - 1) * pageSize + index + 1 }}.
          </span>

          <router-link
            :to="`/rss/${$route.params.rssId}/articles/${article.id}`"
            class="text-blue-500 visited:text-purple-600"
            style="text-decoration: none"
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
      />
    </el-col>

    <el-col :xs="24" :md="14" class="article-detail">
      <router-view />
    </el-col>
  </el-row>
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
.article-layout {
  flex-wrap: wrap;
}

.article-list,
.article-detail {
  margin-bottom: 20px;
}

ul,
li {
  text-align: left;
}
</style>
