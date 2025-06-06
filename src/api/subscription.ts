import api from "../utils/axios";

export interface SubscriptionItem {
  id: string;
  url: string;
  title: string;
  summary?: string;
  createdAt?: string;
}

export interface SubscriptionListResponse {
  items: SubscriptionItem[];
  total: number;
}

export interface SubscribeRequest {
  url: string;
}

export interface ArticleItem {
  id: string;
  link: string;
  published_at: string;
  summary_md?: string;
  title: string;
}

export interface ArticleListResponse {
  items: ArticleItem[];
  total: number;
}

// 获取所有订阅
export async function getAllSubscriptions(params?: {
  page?: number;
  pageSize?: number;
}): Promise<SubscriptionListResponse> {
  const { page = 1, pageSize = 10 } = params || {};
  const offset = (page - 1) * pageSize;

  const res = await api.get("/api/v1/rss/subscriptions", {
    params: {
      limit: pageSize,
      offset: offset,
    },
  });

  // 通常是 { items: [...], total: 100 }
  return res.data;
}

// 添加订阅
export async function addSubscription(
  data: SubscribeRequest,
): Promise<SubscriptionItem> {
  const res = await api.post("/api/v1/rss/subscribe", data);
  return res.data;
}

// 删除订阅
export async function deleteSubscription(feedId: string): Promise<void> {
  await api.delete(`/api/v1/rss/unsubscribe/${feedId}`);
}

export async function fetchArticles(params: {
  rssId: string;
  page?: number;
  pageSize?: number;
}): Promise<ArticleListResponse> {
  const { page = 1, pageSize = 10, rssId } = params || {};
  const offset = (page - 1) * pageSize;

  const res = await api.get(`/api/v1/rss/subscriptions/${rssId}/articles`, {
    params: {
      limit: pageSize,
      offset: offset,
    },
  });

  // 通常是 { items: [...], total: 100 }
  return res.data;
}

export async function fetchArticleDetail(
  rssId: string,
  articleId: string,
): Promise<ArticleItem> {
  const res = await api.get(
    `/api/v1/rss/subscriptions/${rssId}/articles/${articleId}`,
  );
  return res.data;
}
