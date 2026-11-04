import httpClient from './httpClient.js'

const BASE = import.meta.env.VITE_API_URL || '/news'

export const newsApi = {
  list: async (isPublic = false, keyword = '', categoryId = '') => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (categoryId) params.categoryId = categoryId
    const url = isPublic ? `${BASE}/public` : BASE
    return (await httpClient.get(url, { params })).data
  },
  getPublic: async (id) => (await httpClient.get(`${BASE}/public/${id}`)).data,
  categories: async () => (await httpClient.get(`${BASE}/categories`)).data,
  authors: async () => (await httpClient.get(`${BASE}/authors`)).data,
  tags: async () => (await httpClient.get(`${BASE}/tags`)).data,
  create: async (body) => (await httpClient.post(BASE, body)).data,
  update: async (id, body) => (await httpClient.put(`${BASE}/${id}`, body)).data,
  remove: async (id) => (await httpClient.delete(`${BASE}/${id}`)).data,
}
