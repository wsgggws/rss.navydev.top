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
        components: {
          default: ArticleDetail,
          articleList: ArticleList,
        },
        props: {
          default: true,
          articleList: true,
        },
        children: [
          {
            path: ":articleId",
            components: {
              default: ArticleDetail,
              articleList: ArticleList,
            },
            name: "ArticleDetail",
            props: {
              default: true,
              articleList: true,
            },
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
