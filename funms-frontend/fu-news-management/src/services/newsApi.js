// Mot noi duy nhat goi API. Neu doi port backend, sua o day.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/news'

async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Khong the ket noi API')
  return data
}

export const newsApi = {
  list: (isPublic = false, keyword = '', categoryId = '') => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (categoryId) params.set('categoryId', categoryId)
    const query = params.toString()
    return request(`${isPublic ? '/public' : ''}${query ? `?${query}` : ''}`)
  },
  getPublic: (id) => request(`/public/${id}`),
  categories: () => request('/categories'),
  authors: () => request('/authors'),
  tags: () => request('/tags'),
  create: (body) => request('', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
}
