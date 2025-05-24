import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  actions: {
    async login(url: string, credentials: any) {
      let bodyFormData = new FormData();
      bodyFormData.append("username", credentials.username);
      bodyFormData.append("password", credentials.password);
      try {
        // 发送登录请求
        let { data } = await axios.post(url, bodyFormData);
        // 存储到本地
        this.token = data.access_token;
        this.user = data.user || null;
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user || null));
      } catch (error) {
        console.error("登录失败：", error);
        throw new Error("登录失败，请检查用户名和密码");
      }
    },
    restoreFromLocal() {
      let token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        this.token = token;
      } else {
        this.token = "";
      }
      const userStr = localStorage.getItem("user");
      try {
        this.user = userStr ? JSON.parse(userStr) : null;
      } catch (e) {
        console.error("用户信息恢复失败：JSON 解析错误", e);
        this.user = null;
      }
    },
    logout() {
      // 清除本地存储
      this.token = "";
      this.user = null;
      localStorage.clear();
    },
  },
  state: () => {
    return {
      token: "",
      user: null as null | { id: string; email: string },
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});

