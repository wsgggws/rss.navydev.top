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
        <small class="hint"
          >密码需包含大小写、数字、特殊字符，长度不少于8位</small
        >
      </div>

      <button type="submit" :disabled="loading || !formValid">
        {{ loading ? "注册中..." : "注册" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts" name="Register">
import { ref, computed } from "vue";
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
const error = ref("");
const showPassword = ref(false);

// 密码验证规则（必须含大写、小写、数字、特殊字符，且至少8位）
const isPasswordValid = computed(() =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(form.value.password),
);

// 所有字段都不为空且密码合法
const formValid = computed(
  () =>
    form.value.username &&
    form.value.email &&
    form.value.password &&
    isPasswordValid.value,
);

const handleSubmit = async () => {
  if (!formValid.value) return;

  try {
    loading.value = true;
    error.value = "";
    const data = await userRegister(form.value);
    if (data.username) {
      await authStore.login({
        username: form.value.username,
        password: form.value.password,
      });
    }
    if (authStore.isLoggedIn) {
      router.push("/");
    }
  } catch (err: any) {
    const detail = err.response?.data?.detail || "";
    if (detail.includes("username")) {
      error.value = "用户名已被注册，请更换一个。";
    } else if (detail.includes("email")) {
      error.value = "邮箱已被注册，请使用其他邮箱。";
    } else {
      error.value = "注册失败，请重试。";
    }
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
.input-error {
  border-color: red;
  outline: none;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}
.text-red-500 {
  color: red;
}
.password-wrapper {
  position: relative;
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

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: block;
}
</style>
