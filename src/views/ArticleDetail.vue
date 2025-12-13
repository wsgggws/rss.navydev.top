<template>
  <div v-if="article">
    <Markdown :source="article.summary_md" class="custom-markdown" />
    <div class="original-link">
      <!-- 原文链接靠左 -->
      <a
        :href="article.link"
        target="_blank"
        rel="noopener noreferrer"
        class="btn original-btn"
      >
        👉查看原文
      </a>

      <!-- 返回顶部按钮靠右 -->
      <button class="btn back-to-top-btn" @click="scrollToTop">
        ⬆️返回顶部
      </button>
    </div>
  </div>

  <div v-else>
    <p>Loading article...</p>
  </div>
</template>

<script setup lang="ts" name="ArticleDetail">
const Markdown = () => import("vue3-markdown-it");

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

.btn {
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.btn:hover {
  background-color: #66b1ff;
}
.original-link a {
  text-decoration: none; /* 去掉下划线 */
}

/* 两个按钮左右对齐，中间空开 */
.original-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

/* 移动端也保留左右布局，不变方向 */
@media (max-width: 768px) {
  .btn {
    font-size: 13px;
    padding: 5px 10px;
  }

  .original-link {
    padding: 0 10px;
  }
}
</style>
