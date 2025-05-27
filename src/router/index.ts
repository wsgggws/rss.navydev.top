import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import RSSList from "../views/RSSList.vue";
import ArticleList from "../views/ArticleList.vue";
import ArticleDetail from "../views/ArticleDetail.vue";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";

const routes = [
  {
    path: "/rss",
    component: RSSList,
    children: [
      {
        path: ":rssId/articles",
        component: ArticleList,
        props: true, // 启用 props 接收参数
        children: [
          {
            path: ":articleId",
            component: ArticleDetail,
            name: "ArticleDetail",
            props: true,
          },
        ],
      },
    ],
    meta: { requiresAuth: true },
  },
  { path: "/login", component: Login },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
