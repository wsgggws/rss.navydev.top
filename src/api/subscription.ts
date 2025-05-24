import api from "../utils/axios";

export interface SubscriptionItem {
  id: string;
  url: string;
  title: string;
  summary?: string;
  createdAt?: string;
}

export interface SubscribeRequest {
  url: string;
}

// 获取所有订阅
export async function getAllSubscriptions(): Promise<SubscriptionItem[]> {
  const res = await api.get("/api/v1/rss/subscriptions");
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
