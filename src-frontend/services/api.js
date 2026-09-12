const API_BASE = '/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

function getAccessKey() {
  return sessionStorage.getItem('accessKey')
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const accessKey = getAccessKey()
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }
  
  if (accessKey) {
    config.headers['X-Access-Key'] = accessKey
  }

  const response = await fetch(url, config)
  
  // 处理 204 No Content
  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status)
  }

  return data
}

export const api = {
  // 域名
  async getDomains() {
    const data = await request('/domains')
    return data['hydra:member'] || []
  },

  // 账户
  async createAccount(address, password) {
    return request('/accounts', {
      method: 'POST',
      body: JSON.stringify({ address, password }),
    })
  },

  async generateRandomEmail(domain = null) {
    const body = domain ? { domain } : {}
    return request('/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  async createCustomEmail(address) {
    return request('/custom', {
      method: 'POST',
      body: JSON.stringify({ address }),
    })
  },

  async getToken(address, password) {
    return request('/token', {
      method: 'POST',
      body: JSON.stringify({ address, password }),
    })
  },

  async getMe(token) {
    return request('/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async deleteAccount(id, token) {
    return request(`/accounts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async extendExpiry(token, minutes = 30) {
    return request('/me/extend', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ minutes }),
    })
  },

  // 邮件
  async getMessages(token, page = 1) {
    const data = await request(`/messages?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return {
      mails: data['hydra:member'] || [],
      total: data['hydra:totalItems'] || 0,
    }
  },

  async getMessage(id, token) {
    return request(`/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async markAsRead(id, token) {
    return request(`/messages/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async deleteMessage(id, token) {
    return request(`/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async getSource(id, token) {
    return request(`/sources/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  // 附件
  getAttachmentUrl(id) {
    return `${API_BASE}/attachments/${id}`
  },

  async downloadAttachment(id, { admin = false, token } = {}) {
    const headers = {}
    const accessKey = getAccessKey()
    if (accessKey) headers['X-Access-Key'] = accessKey
    if (!admin && token) headers.Authorization = `Bearer ${token}`

    const response = await fetch(
      admin ? `${API_BASE}/admin/attachments/${id}` : `${API_BASE}/attachments/${id}`,
      { headers },
    )
    if (!response.ok) {
      throw new ApiError('Download failed', response.status)
    }
    return response.blob()
  },

  // 管理员：查看全部邮箱与邮件
  async getAdminAccounts() {
    const data = await request('/admin/accounts')
    return data['hydra:member'] || []
  },

  async getAdminMessages({ page = 1, accountId, limit = 50 } = {}) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (accountId) params.set('accountId', accountId)
    const data = await request(`/admin/messages?${params}`)
    return {
      mails: data['hydra:member'] || [],
      total: data['hydra:totalItems'] || 0,
    }
  },

  async getAdminMessage(id) {
    return request(`/admin/messages/${id}`)
  },

  async markAdminMessageRead(id) {
    return request(`/admin/messages/${id}`, { method: 'PATCH' })
  },

  async deleteAdminMessage(id) {
    return request(`/admin/messages/${id}`, { method: 'DELETE' })
  },
}

export { ApiError }
