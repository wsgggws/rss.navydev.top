<!-- ArticleDetail.vue 三级路由 -->
<template>
  <div v-if="article">
    <div class="meta text-sm text-gray-500 flex gap-4 mb-4">
      <a :href="article.link" target="_blank" class="text-blue-500 underline"
        >原文链接</a
      >
    </div>

    <Markdown :source="article.summary_md" class="custom-markdown" />
  </div>

  <div v-else>
    <p>Loading article...</p>
  </div>
</template>

<script setup lang="ts" name="ArticleDetail">
import Markdown from "vue3-markdown-it";

import { ref, watch } from "vue";
import { fetchArticleDetail, type ArticleItem } from "../api/subscription";

const article = ref<ArticleItem | null>(null); // 初始化为 null

// 通过 props 接收 articleId
const props = defineProps({
  rssId: {
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
});
// 同时监听两个参数的变化
watch(
  [() => props.rssId, () => props.articleId],
  async ([newRssId, newArticleId]) => {
    try {
      const data = await fetchArticleDetail(newRssId, newArticleId);

      // 添加类型守卫
      if (!data.id || !data.title) {
        throw new Error("Invalid article data structure");
      }

      article.value = data as ArticleItem;
    } catch (error) {
      console.error("Failed to load article:", error);
      article.value = null;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.custom-markdown {
  text-align: left;
  max-width: 100%;
}

.custom-markdown ul,
.custom-markdown ol {
  list-style: none;
  padding-left: 0;
}

.custom-markdown li::marker {
  content: none;
}
</style>
