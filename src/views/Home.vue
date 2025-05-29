<template>
  <div class="home-container">
    <!-- 顶部右上角按钮 -->
    <div class="top-right">
      <template v-if="!isLoggedIn">
        <RouterLink to="/login" class="top-btn">登录</RouterLink>
        <RouterLink to="/register" class="top-btn">注册</RouterLink>
      </template>
      <template v-else>
        <button @click="handleLogout" class="top-btn">
          登出（{{ authStore.username || "用户" }}）
        </button>
      </template>
    </div>

    <!-- 标题和介绍 -->
    <h1>📡 News Summary 智能摘要系统</h1>
    <p class="description">
      使用 AI 技术，对 RSS 新闻内容进行智能提取与个性化摘要，节省你的阅读时间。
    </p>
    <p class="opensource">
      本项目为开源作品，欢迎 PR ; )
      <br />
      🔧 后端仓库
      <span v-if="backendStarCount !== null">⭐ {{ backendStarCount }}</span
      >：
      <a href="https://github.com/wsgggws/news-summary" target="_blank">
        news-summary-backend</a
      ><br />

      🎨 前端仓库(有体验账号)
      <span v-if="frontendStarCount !== null">⭐ {{ frontendStarCount }}</span
      >：
      <a href="https://github.com/wsgggws/news-summary-front" target="_blank">
        news-summary-front</a
      ><br />

      📺 B站分享：
      <a
        href="https://space.bilibili.com/472722204/lists/5018471?type=season"
        target="_blank"
        >合集·(FastAPI)News-Summary</a
      >
    </p>

    <!-- 推荐 RSS -->
    <h2 class="section-title">🔥 热门订阅推荐</h2>
    <ul class="rss-list">
      <li v-for="feed in recommendedFeeds" :key="feed.id">
        <button
          class="btn"
          :disabled="feed.isSubscribed"
          :class="{ disabled: feed.isSubscribed }"
          @click="handleSubscribe(feed)"
        >
          订阅
        </button>
        <span class="spacer"></span>
        <strong>{{ feed.title }}</strong> - {{ feed.description }}
      </li>
    </ul>

    <!-- 我的订阅按钮 -->
    <div class="auth-links">
      <RouterLink to="/rss" class="btn">👀 查看我的订阅</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
import { computed, ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { addSubscription } from "../api/subscription";
import { handleApiError } from "../utils/handleError";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);

const handleLogout = () => {
  authStore.logout();
};

// 推荐订阅，可从 API 获取替换
const recommendedFeeds = ref([
  {
    id: 1,
    title: "美团技术团队",
    description: "技术知识分享",
    url: "https://tech.meituan.com/feed",
    isSubscribed: false,
  },
  {
    id: 2,
    title: "少数派",
    description: "数字生活方式指南",
    url: "https://sspai.com/feed",
    isSubscribed: false,
  },
  {
    id: 3,
    title: "阮一峰的网络日志",
    description: "商业与科技新知",
    url: "http://feeds.feedburner.com/ruanyifeng",
    isSubscribed: false,
  },
  {
    id: 4,
    title: "V2EX",
    description: "程序员讨论社区",
    url: "https://v2ex.com/index.xml",
    isSubscribed: false,
  },
  {
    id: 5,
    title: "Linux.com",
    description: "News For Open Source Professionals",
    url: "https://www.linux.com/feed/",
    isSubscribed: false,
  },
]);
const handleSubscribe = async (feed: any) => {
  if (!isLoggedIn.value) {
    ElMessage.warning("请先登录后再订阅");
    return;
  }
  try {
    const data = await addSubscription({ url: feed.url });
    ElMessage.success(`成功订阅：${data.title}`);
    feed.isSubscribed = true;
  } catch (err: any) {
    handleApiError(err);
    const message: string = err.response?.data?.detail || "";
    if (message.includes("has been subscribed")) {
      feed.isSubscribed = true;
    }
  }
};

const backendStarCount = ref<number | null>(null);
const frontendStarCount = ref<number | null>(null);
const fetchStarCount = async (
  repo: string,
  setter: (val: number | null) => void,
) => {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`);
    if (res.ok) {
      const data = await res.json();
      setter(data.stargazers_count);
    } else {
      setter(null);
    }
  } catch {
    setter(null);
  }
};

onMounted(() => {
  fetchStarCount(
    "wsgggws/news-summary",
    (count) => (backendStarCount.value = count),
  );
  fetchStarCount(
    "wsgggws/news-summary-front",
    (count) => (frontendStarCount.value = count),
  );
});
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  text-align: center;
}

/* 顶部右上角按钮 */
.top-right {
  position: absolute;
  top: 20px;
  right: 20px;
}

.top-btn {
  margin-left: 10px;
  padding: 6px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.top-btn:hover {
  background-color: #369d73;
}

.description {
  font-size: 1.2em;
  margin: 20px 0;
}

.section-title {
  margin-top: 40px;
  font-size: 1.5em;
}

.rss-list {
  list-style: none;
  padding: 0;
  text-align: left;
  margin-top: 20px;
}

.rss-list li {
  margin-bottom: 10px;
}

.auth-links {
  margin-top: 30px;
}

.btn {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
}

.btn:hover {
  background-color: #369d73;
}
.rss-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.subscribe-btn {
  padding: 6px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.subscribe-btn:hover {
  background-color: #36966e;
}
button.disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
.opensource {
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.opensource a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.opensource a:hover {
  text-decoration: underline;
}
.spacer {
  display: inline-block;
  width: 10px;
}
.github-star-btn {
  background-color: transparent;
  border: none;
  color: #42b983;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  margin-left: 6px;
}

.github-star-btn:hover {
  text-decoration: underline;
}

.github-star-btn span {
  margin-left: 6px;
  color: #f5a623;
  font-weight: normal;
}
</style>
