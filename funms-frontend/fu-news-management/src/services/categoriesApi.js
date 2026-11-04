import httpClient from './httpClient.js'

const BASE = import.meta.env.VITE_CATEGORIES_API_URL || '/categories'

export async function getCategoryById(id) {
  return (await httpClient.get(`${BASE}/${id}`)).data
}

export async function getCategories(page = 0, size = 5, keyword = '', isActive = '') {
  const params = { page, size }
  if (keyword) params.keyword = keyword.trim()
  if (isActive !== '') params.isActive = isActive
  return (await httpClient.get(BASE, { params })).data
}

export async function searchAllActive(keyword = '', page = 0, size = 5) {
  const params = { page, size }
  if (keyword) params.keyword = keyword.trim()
  return (await httpClient.get(`${BASE}/active`, { params })).data
}

export async function getAllCategoryActiveDropdown() {
  return (await httpClient.get(`${BASE}/all`)).data
}

export async function createCategory(data) {
  return (await httpClient.post(BASE, data)).data
}

export async function updateCategory(id, data) {
  return (await httpClient.put(`${BASE}/${id}`, data)).data
}

export async function deleteCategory(id) {
  await httpClient.delete(`${BASE}/${id}`)
}
