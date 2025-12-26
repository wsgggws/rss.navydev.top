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
import { ref, watch } from "vue";
import { fetchArticleDetail, type ArticleItem } from "../api/subscription";
import Markdown from "vue3-markdown-it";

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
  line-height: 1.8;
  color: #2d3748;
}

.custom-markdown ul,
.custom-markdown ol {
  list-style: none;
  padding-left: 0;
}

.custom-markdown li::marker {
  content: none;
}

.custom-markdown h1,
.custom-markdown h2,
.custom-markdown h3 {
  color: #1a202c;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.custom-markdown p {
  margin-bottom: 1em;
}

.custom-markdown code {
  background: #f7fafc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.back-to-top-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.back-to-top-btn:hover {
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
}

.original-link a {
  text-decoration: none;
}

.original-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  gap: 12px;
}

@media (max-width: 768px) {
  .btn {
    font-size: 13px;
    padding: 8px 16px;
  }

  .original-link {
    margin-top: 1.5rem;
    padding-top: 1rem;
  }
}
</style>
