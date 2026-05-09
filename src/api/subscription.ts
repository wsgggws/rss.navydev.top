import api from '../utils/axios'

export interface SubscriptionItem {
  id: string
  url: string
  title: string
  summary?: string
  createdAt?: string
}

export interface SubscriptionListResponse {
  items: SubscriptionItem[]
  total: number
}

export interface ArticleItem {
  id: string
  link: string
  published_at: string
  summary_md?: string
  title: string
  author?: string
  rss_id?: string
  view_count?: number
}

export interface ArticleListResponse {
  items: ArticleItem[]
  total: number
}

export interface ArticleFilter {
  rssIds?: string[]
  search?: string
  startDate?: string
  endDate?: string
}

export async function getAllSubscriptions(params?: {
  page?: number
  pageSize?: number
}): Promise<SubscriptionListResponse> {
  const { page = 1, pageSize = 10 } = params || {}
  const offset = (page - 1) * pageSize

  return api.get('/api/v1/rss/subscriptions', {
    params: { limit: pageSize, offset },
  })
}

export async function fetchArticles(params: {
  rssId: string
  page?: number
  pageSize?: number
}): Promise<ArticleListResponse> {
  const { page = 1, pageSize = 10, rssId } = params || {}
  const offset = (page - 1) * pageSize

  return api.get(`/api/v1/rss/subscriptions/${rssId}/articles`, {
    params: { limit: pageSize, offset },
  })
}

export async function fetchArticleDetail(
  rssId: string,
  articleId: string,
): Promise<ArticleItem> {
  return api.get(`/api/v1/rss/subscriptions/${rssId}/articles/${articleId}`)
}

export async function fetchAllArticles(params?: {
  page?: number
  pageSize?: number
}): Promise<ArticleListResponse> {
  const { page = 1, pageSize = 100 } = params || {}
  const offset = (page - 1) * pageSize

  return api.get('/api/v1/rss/articles', {
    params: { limit: pageSize, offset },
  })
}

export async function trackVisit(): Promise<{ total_visits: number }> {
  return api.post('/api/v1/visit/track')
}

export async function getVisitCount(): Promise<{ total_visits: number }> {
  return api.get('/api/v1/visit/count')
}