import { describe, expect, it } from 'vitest'
import { formatArticleDate, parseArticleDate } from '../src/utils/date'

describe('article dates', () => {
  it.each([
    '1970-01-01T00:00:00Z',
    '1970-12-31T23:59:59Z',
    '0',
    '',
    undefined,
    'not-a-date',
  ])('treats %s as an unknown date', value => {
    expect(parseArticleDate(value)).toBeNull()
    expect(formatArticleDate(value)).toBe('日期未知')
  })

  it('formats a valid recent date', () => {
    expect(
      formatArticleDate('2026-09-12T08:00:00Z', {
        relative: true,
        now: new Date('2026-09-13T12:00:00+08:00'),
      }),
    ).toBe('昨天')
  })
})
