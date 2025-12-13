import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("../views/Home.vue");
const Login = () => import("../views/Login.vue");
const Register = () => import("../views/Register.vue");
const RSSList = () => import("../views/RSSList.vue");
const ArticleList = () => import("../views/ArticleList.vue");
const ArticleDetail = () => import("../views/ArticleDetail.vue");

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
