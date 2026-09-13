const EPOCH_PLACEHOLDER_YEAR = 1970

export function parseArticleDate(value?: string | null): Date | null {
  if (!value) return null

  const normalized = value.trim()
  if (!normalized) return null

  if (/^\d+$/.test(normalized) && !/^\d{10}$|^\d{13}$/.test(normalized)) {
    return null
  }

  const timestamp = /^\d{10}$/.test(normalized)
    ? Number(normalized) * 1000
    : /^\d{13}$/.test(normalized)
      ? Number(normalized)
      : normalized
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() <= EPOCH_PLACEHOLDER_YEAR) {
    return null
  }

  return date
}

export function formatArticleDate(
  value?: string | null,
  options: { relative?: boolean; now?: Date } = {},
): string {
  const date = parseArticleDate(value)
  if (!date) return '日期未知'

  const { relative = false, now = new Date() } = options
  if (relative) {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const daysAgo = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000)

    if (daysAgo === 0) return '今天'
    if (daysAgo === 1) return '昨天'
    if (daysAgo > 1 && daysAgo < 7) return `${daysAgo} 天前`
  }

  return date.toLocaleDateString('zh-CN', {
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
