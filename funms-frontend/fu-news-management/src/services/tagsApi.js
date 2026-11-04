import httpClient from './httpClient.js'

const BASE = import.meta.env.VITE_TAGS_API_URL || '/tags'

export async function searchAllTags(keyword = '', page = 0, size = 5) {
  const params = { page, size }
  if (keyword) params.keyword = keyword.trim()
  return (await httpClient.get(BASE, { params })).data
}

export async function getTagById(id) {
  return (await httpClient.get(`${BASE}/${id}`)).data
}

export async function getAllTagsDropdown() {
  return (await httpClient.get(`${BASE}/all`)).data
}

export async function createTag(data) {
  return (await httpClient.post(BASE, data)).data
}

export async function updateTag(id, data) {
  return (await httpClient.put(`${BASE}/${id}`, data)).data
}

export async function deleteTag(id) {
  await httpClient.delete(`${BASE}/${id}`)
}
