<template>
  <div class="register-container">
    <h2>注册(📡News Summary)</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="form.username" required />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "注册中..." : "注册" }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts" name="Register">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { userRegister } from "../api/user";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: "",
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;
    const data = await userRegister(form.value);
    if (data.username) {
      // 注册成功后自动登录或跳转登录页
      await authStore.login({
        username: form.value.username,
        password: form.value.password,
      });
    }
    if (authStore.isLoggedIn) {
      router.push("/");
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || "注册失败，请重试";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
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
