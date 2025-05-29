<template>
  <div class="rss-container">
    <!-- 顶部右上角返回首页按钮 -->
    <div class="top-right">
      <router-link to="/" class="top-btn">🏠 返回首页</router-link>
    </div>

    <el-row :gutter="10" type="flex" class="main-row">
      <el-col :span="1"> </el-col>

      <el-col :span="4" class="left-panel">
        <h1 class="title">📡 我的订阅</h1>

        <!-- 添加订阅 -->
        <div class="flex gap-2 mt-4">
          <el-input
            v-model="newUrl"
            placeholder="输入订阅链接"
            class="flex-1 border rounded px-3 py-2"
          />
          <el-button type="primary" :loading="adding" @click="handleAdd"
            >添加订阅</el-button
          >
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="text-center text-gray-500 mt-4">
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
          class="mt-4"
        />

        <!-- 订阅列表 -->
        <div v-if="subscriptions.length > 0 && !loading" class="space-y-2 mt-4">
          <div v-for="rss in subscriptions" :key="rss.id" class="rss-item">
            <el-button
              type="danger"
              size="small"
              class="delete-btn"
              @click="() => confirmDelete(rss.id)"
              >删除</el-button
            >
            <router-link :to="`/rss/${rss.id}/articles`" class="rss-title">{{
              rss.title
            }}</router-link>
          </div>
        </div>
        <div v-else-if="!loading && !errorMsg" class="text-gray-500 mt-4">
          暂无订阅
        </div>

        <!-- 分页 -->
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalCount"
          layout="prev, pager, next, total"
          @current-change="fetchSubscriptions"
          class="mt-6"
        />
      </el-col>

      <el-col :span="18" class="right-panel">
        <router-view />
      </el-col>
      <el-col :span="1"> </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="RSSList">
import { ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Loading } from "@element-plus/icons-vue";

import {
  getAllSubscriptions,
  addSubscription,
  deleteSubscription,
  type SubscriptionItem,
} from "../api/subscription";
import { handleApiError } from "../utils/handleError";

const subscriptions = ref<SubscriptionItem[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 12;
const newUrl = ref();

const loading = ref(false);
const adding = ref(false);
const errorMsg = ref("");

async function confirmDelete(id: string) {
  try {
    await ElMessageBox.confirm("确定要删除该订阅吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    handleDelete(id);
    ElMessage.success("已删除");
  } catch (error) {
    ElMessage.info("已取消删除");
  }
}

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
  setTimeout(fetchSubscriptions, 100);
});

const handleAdd = async () => {
  if (!newUrl.value?.trim()) {
    ElMessage.warning("请输入订阅链接");
    return;
  }

  adding.value = true;
  try {
    await addSubscription({ url: newUrl.value.trim() });
    ElMessage.success("添加成功");
    fetchSubscriptions();
  } catch (err: any) {
    handleApiError(err);
  } finally {
    adding.value = false;
    newUrl.value = "";
  }
};

const handleDelete = async (id: string) => {
  try {
    await deleteSubscription(id);
    ElMessage.success("删除成功");
    fetchSubscriptions();
  } catch (err: any) {
    handleApiError(err);
  }
};
</script>

<style scoped>
/* 主容器 */
.rss-container {
  position: relative;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 20px;
}

/* 顶部右上角按钮 */
.top-right {
  position: absolute;
  top: 20px;
  right: 30px;
  z-index: 10;
}

.top-btn {
  padding: 6px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
}

.top-btn:hover {
  background-color: #369d73;
}

/* 标题 */
.title {
  font-size: 1.5em;
  font-weight: bold;
}

/* 左侧订阅列表区域 */
.left-panel {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
}

/* 右侧内容展示区 */
.right-panel {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
}

/* 订阅条目样式 */
.rss-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 10px 12px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.rss-title {
  flex: 1;
  text-align: left;
  color: #333;
  font-weight: 500;
  text-decoration: none;
}

.rss-title:hover {
  color: #42b983;
}

.delete-btn {
  margin-right: 16px;
}
</style>
