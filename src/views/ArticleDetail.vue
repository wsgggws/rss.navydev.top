<template>
  <div v-if="article">
    <Markdown :source="article.summary_md" class="custom-markdown" />
    <div class="original-link flex justify-between items-center mt-4">
      <!-- 返回顶部按钮 -->
      <button class="btn back-to-top-btn" @click="scrollToTop">
        ⬆️ 返回顶部
      </button>

      <a
        :href="article.link"
        target="_blank"
        rel="noopener noreferrer"
        class="btn original-btn"
      >
        🔗 原文链接
      </a>
    </div>
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
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
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

.original-link {
  margin-top: 40px;
  text-align: right;
}

.original-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.original-btn:hover {
  background-color: #369d73;
}

@media (max-width: 768px) {
  .original-link {
    text-align: center;
    margin-top: 20px;
  }

  .original-btn {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }
}
.btn {
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn:hover {
  background-color: #66b1ff;
}

.original-link {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .btn {
    font-size: 13px;
    padding: 5px 10px;
  }

  .original-link {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
