import { defineStore } from "pinia";
import { userLogin } from "../api/user";

export const useAuthStore = defineStore("auth", {
  actions: {
    async login(credentials: any) {
      try {
        // 发送登录请求
        const data = await userLogin(credentials);
        // 存储到本地
        this.token = data.access_token;
        this.username = data.username;
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
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
        this.username = userStr ? JSON.parse(userStr) : null;
      } catch (e) {
        console.error("用户信息恢复失败：JSON 解析错误", e);
        this.username = "";
      }
    },
    logout() {
      // 清除本地存储
      this.token = "";
      this.username = "";
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    },
    init() {
      this.token = localStorage.getItem("token") || "";
      this.username = localStorage.getItem("username") || "";
    },
  },
  state: () => {
    return {
      token: "",
      username: "",
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});
