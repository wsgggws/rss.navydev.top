import { ref, watch, onMounted } from 'vue';

const isDark = ref(false);

export function useDarkMode() {
  onMounted(() => {
    // 从 localStorage 读取主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      // 检测系统主题偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    applyTheme();
  });

  watch(isDark, () => {
    applyTheme();
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  });

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  return {
    isDark,
    toggleTheme
  };
}
