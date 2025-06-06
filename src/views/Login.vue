<template>
  <div class="login-container">
    <div class="top-right">
      <router-link to="/" class="top-btn">🏠 返回首页</router-link>
    </div>
    <h2>登录(📡News Summary)</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="form.username" required />
      </div>

      <div class="form-group password-group">
        <label for="password">密码</label>
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            required
          />
          <button
            type="button"
            class="toggle-btn"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? "🙈 隐藏" : "👁️ 显示" }}
          </button>
        </div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "登录中..." : "登录" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts" name="Login">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref(null);
const showPassword = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;
    await authStore.login(form.value);
    if (authStore.isLoggedIn) {
      router.push("/");
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || "登录失败，请重试";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.password-wrapper {
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
}

.toggle-btn {
  margin-left: 8px;
  padding: 5px 10px;
  font-size: 14px;
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-btn:hover {
  background-color: #eee;
}

button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
