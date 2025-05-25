<!-- RssLayout.vue -->
<template>
  <div class="flex gap-4">
    <!-- 左栏：订阅列表 -->
    <div class="w-1/4">
      <router-view name="sidebar" />
    </div>

    <!-- 中栏：文章列表 -->
    <div class="w-2/4">
      <router-view name="articles" />
    </div>

    <!-- 右栏：文章详情 -->
    <div class="w-1/4 prose">
      <router-view name="detail" />
    </div>
  </div>
</template>

<script setup lang="ts" name="RSSLayout"></script>

<style scoped></style>
