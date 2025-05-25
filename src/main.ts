// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);

router.beforeEach((to, _, next) => {
  const auth = useAuthStore();

  // 若未恢复登录状态，则先尝试恢复
  if (!auth.token) auth.restoreFromLocal();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

app.use(router);
app.use(createPinia());
app.use(ElementPlus);

app.mount("#app");
