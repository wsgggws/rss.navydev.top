<template>
  <div v-if="article" class="article-detail-wrapper">
    <!-- 文章头部信息 -->
    <div class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="meta-item">
          <i class="icon">📅</i>
          {{ formatDate(article.published_at) }}
        </span>
        <span v-if="article.author" class="meta-item">
          <i class="icon">✍️</i>
          {{ article.author }}
        </span>
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="article-content">
      <div class="markdown-body" v-html="articleHtml"></div>
    </div>

    <!-- 底部操作栏 -->
    <div class="article-footer">
      <a
        :href="article.link"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary"
      >
        <span class="btn-icon">🔗</span>
        阅读原文
      </a>

      <button class="btn btn-secondary" @click="scrollToTop">
        <span class="btn-icon">⬆️</span>
        返回顶部
      </button>
    </div>
  </div>

  <div v-else class="loading-state">
    <div class="loading-spinner"></div>
    <p>加载中...</p>
  </div>
</template>

<script setup lang="ts" name="ArticleDetail">
import { ref, watch, computed } from "vue";
import { fetchArticleDetail, type ArticleItem } from "../api/subscription";

const article = ref<ArticleItem | null>(null);

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

// 简单的 Markdown 转 HTML（基础支持）
const articleHtml = computed(() => {
  if (!article.value?.summary_md) return '';
  
  let html = article.value.summary_md
    // 代码块
    .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre><code>$2</code></pre>')
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // 图片
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 引用
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // 分割线
    .replace(/^---$/gim, '<hr>')
    // 无序列表
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // 段落
    .split('\n\n')
    .map(para => para.trim() ? (para.startsWith('<') ? para : `<p>${para}</p>`) : '')
    .join('\n');
  
  return html;
});

watch(
  [() => props.rssId, () => props.articleId],
  async ([newRssId, newArticleId]) => {
    try {
      const data = await fetchArticleDetail(newRssId, newArticleId);

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.article-detail-wrapper {
  max-width: 100%;
  padding: 0;
}

/* 文章头部 */
.article-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-image-slice: 1;
}

.article-title {
  font-size: 2.2em;
  font-weight: 800;
  line-height: 1.3;
  color: #1a202c;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #718096;
  font-size: 0.95em;
  font-weight: 500;
}

.icon {
  font-style: normal;
}

/* 文章内容 Markdown 样式 */
.article-content {
  margin-bottom: 40px;
}

.markdown-body {
  text-align: left;
  line-height: 1.8;
  color: #2d3748;
  font-size: 16px;
}

/* 标题样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: 700;
  line-height: 1.4;
  color: #1a202c;
}

.markdown-body :deep(h1) {
  font-size: 1.8em;
  padding-bottom: 0.3em;
  border-bottom: 2px solid #e2e8f0;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #e2e8f0;
}

.markdown-body :deep(h3) {
  font-size: 1.3em;
}

.markdown-body :deep(h4) {
  font-size: 1.1em;
}

/* 段落样式 */
.markdown-body :deep(p) {
  margin-bottom: 1.2em;
  line-height: 1.8;
}

/* 链接样式 */
.markdown-body :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
}

.markdown-body :deep(a:hover) {
  color: #764ba2;
  border-bottom-color: #764ba2;
}

/* 列表样式 */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 1.2em;
  padding-left: 2em;
}

.markdown-body :deep(ul) {
  list-style: disc;
}

.markdown-body :deep(ol) {
  list-style: decimal;
}

.markdown-body :deep(li) {
  margin-bottom: 0.5em;
  line-height: 1.8;
}

.markdown-body :deep(li::marker) {
  color: #667eea;
}

/* 引用样式 */
.markdown-body :deep(blockquote) {
  margin: 1.5em 0;
  padding: 1em 1.5em;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-left: 4px solid #667eea;
  border-radius: 0 8px 8px 0;
  color: #4a5568;
  font-style: italic;
}

.markdown-body :deep(blockquote p) {
  margin: 0;
}

/* 代码样式 */
.markdown-body :deep(code) {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.9em;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  color: #e17055;
  border: 1px solid #e2e8f0;
}

.markdown-body :deep(pre) {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  padding: 1.5em;
  border-radius: 12px;
  overflow-x: auto;
  margin: 1.5em 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  border: none;
  color: #e2e8f0;
  font-size: 0.9em;
}

/* 图片样式 */
.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 1.5em 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.markdown-body :deep(img:hover) {
  transform: scale(1.02);
}

/* 表格样式 */
.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.markdown-body :deep(th) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.markdown-body :deep(tr:hover) {
  background: #f7fafc;
}

/* 分割线 */
.markdown-body :deep(hr) {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  margin: 2em 0;
}

/* 底部操作栏 */
.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn-icon {
  font-size: 1.2em;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
}

.btn:active {
  transform: translateY(0);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #718096;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .article-title {
    font-size: 1.6em;
  }

  .article-meta {
    gap: 12px;
  }

  .meta-item {
    font-size: 0.85em;
  }

  .markdown-body {
    font-size: 15px;
  }

  .markdown-body :deep(h1) {
    font-size: 1.5em;
  }

  .markdown-body :deep(h2) {
    font-size: 1.3em;
  }

  .markdown-body :deep(h3) {
    font-size: 1.15em;
  }

  .article-footer {
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    width: 100%;
    justify-content: center;
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
