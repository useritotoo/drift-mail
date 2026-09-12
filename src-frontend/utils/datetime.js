import { parseUtcDate } from '../../src/datetime.js'

export { parseUtcDate, toIsoUtc } from '../../src/datetime.js'

export function formatRelativeTime(value, now = new Date()) {
  const date = parseUtcDate(value)
  if (!date) return ''

  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString()
}

export function formatLocalDateTime(value) {
  const date = parseUtcDate(value)
  if (!date) return ''

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
