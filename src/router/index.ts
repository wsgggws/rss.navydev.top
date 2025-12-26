import { createRouter, createWebHistory } from "vue-router";

const RSSList = () => import("../views/RSSList.vue");
const ArticleList = () => import("../views/ArticleList.vue");
const ArticleDetail = () => import("../views/ArticleDetail.vue");

const routes = [
  {
    path: "/",
    component: RSSList,
    children: [
      {
        path: ":rssId/articles",
        component: ArticleList,
        props: true,
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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
