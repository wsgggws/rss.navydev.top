<template>
  <div class="home">
    <h2>News Summary</h2>

    <hr />
    <p v-if="subscriptions.length === 0">暂无订阅</p>

    <div class="p-4">
      <el-input v-model="newUrl" placeholder="输入订阅链接" class="w-80 mr-2" />
      <el-button type="primary" @click="handleAdd(newUrl)">添加订阅</el-button>
    </div>

    <br />
    <div v-for="item in subscriptions" :key="item.id">
      <a href="{{ item.url }}"> {{ item.title }} </a> <el-button type="second" @click="handleDelete(item.id)">删除</el-button>
    </div>

  </div>
</template>

<script setup lang="ts" name="Home">
  import { ref, onMounted } from "vue"
  import { getAllSubscriptions, addSubscription, deleteSubscription, type SubscriptionItem } from "../api/subscription"

  const subscriptions = ref<SubscriptionItem[]>([])
  const newUrl = ref()

  onMounted(() => {
    setTimeout(async ()=>{
      subscriptions.value = (await getAllSubscriptions()) as SubscriptionItem[]
    },100)
  })

  async function handleAdd(url: string) {
    if (! !!url) {
      alert("请输入有效的订阅链接")
      return
    }
    const newItem = await addSubscription({ url })
    subscriptions.value.push(newItem)
    newUrl.value = "" // 清空输入框
  }

  async function handleDelete(id: string) {
    await deleteSubscription(id)
    subscriptions.value = subscriptions.value.filter((item) => item.id !== id)
  }
</script>

<style scoped>
.home {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>