<template>
  <el-row :gutter="10" type="flex" class="h-screen">
    <el-col :span="1" class="bg-green-100 p-4"> </el-col>

    <el-col :span="4" class="bg-red-100 p-4">
      <h1 class="text-2xl font-bold">📡 我的订阅</h1>
      <!-- add subscription -->
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

      <br />

      <!-- loading spinner -->
      <div v-if="loading" class="text-center text-gray-500">
        <el-icon><Loading /></el-icon> 加载中...
      </div>

      <!-- error message -->
      <el-alert
        v-if="errorMsg"
        title="出错了"
        type="error"
        :description="errorMsg"
        show-icon
        closable
        @close="errorMsg = ''"
      />

      <!-- subscription list -->
      <div v-if="subscriptions.length > 0 && !loading" class="space-y-2">
        <div
          v-for="rss in subscriptions"
          :key="rss.id"
          class="flex justify-between items-center p-2 bg-gray-50 rounded shadow rss-container"
        >
          <div class="flex-1">
            <el-button
              type="danger"
              size="small"
              class="my-el-button"
              @click="() => confirmDelete(rss.id)"
              >删除</el-button
            >
            <router-link :to="`/rss/${rss.id}/articles`" class="my-rss-list">{{
              rss.title
            }}</router-link>
          </div>
        </div>
      </div>
      <div v-else-if="!loading && !errorMsg" class="text-gray-500">
        暂无订阅
      </div>

      <hr />
      <hr />
      <!-- pagination -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalCount"
        layout="prev, pager, next, total"
        @current-change="fetchSubscriptions"
      />
    </el-col>

    <el-col :span="18" class="bg-green-100 p-4">
      <router-view />
    </el-col>
    <el-col :span="1" class="bg-green-100 p-4"> </el-col>
  </el-row>
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
    // 确认后执行删除
    handleDelete(id);
    ElMessage.success("已删除");
  } catch (error) {
    // 用户取消，无需操作
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
    errorMsg.value = err?.message || "获取订阅失败";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  setTimeout(async () => {
    const data = await getAllSubscriptions({
      page: currentPage.value,
      pageSize: pageSize,
    });
    subscriptions.value = data.items;
    totalCount.value = data.total;
  }, 100);
});

const handleAdd = async () => {
  if (!newUrl.value.trim()) {
    ElMessage.warning("请输入订阅链接");
    return;
  }

  adding.value = true;
  try {
    await addSubscription({ url: newUrl.value.trim() });
    ElMessage.success("添加成功");
    newUrl.value = "";
    fetchSubscriptions();
  } catch (err: any) {
    errorMsg.value = err?.message || "添加失败";
  } finally {
    adding.value = false;
  }
};

const handleDelete = async (id: string) => {
  try {
    await deleteSubscription(id);
    ElMessage.success("删除成功");
    fetchSubscriptions();
  } catch (err: any) {
    errorMsg.value = err?.message || "删除失败";
  }
};
</script>

<style scoped>
.rss-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-rss-list {
  text-align: left;
  flex: 1;
}

.my-el-button {
  margin-right: 20px;
}
</style>
