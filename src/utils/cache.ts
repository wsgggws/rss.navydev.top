/**
 * 缓存管理工具
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // 过期时间（毫秒）
}

class CacheManager {
  private prefix = 'rss_cache_';

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 数据
   * @param expiresIn 过期时间（毫秒），默认5分钟
   */
  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn
    };
    
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn('缓存设置失败:', error);
    }
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 数据或 null
   */
  get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.prefix + key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      // 检查是否过期
      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('缓存读取失败:', error);
      return null;
    }
  }

  /**
   * 删除缓存
   */
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * 检查缓存是否存在且有效
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cacheManager = new CacheManager();
