import httpClient from './httpClient.js'

const BASE = '/editor/articles'

export const editorApi = {
  list: async () => (await httpClient.get(BASE)).data,
  pending: async () => (await httpClient.get(`${BASE}/pending`)).data,
  approve: async (id) => (await httpClient.post(`${BASE}/${id}/approve`)).data,
  requestChanges: async (id, feedback) =>
    (await httpClient.post(`${BASE}/${id}/request-changes`, { feedback })).data,
  reject: async (id, feedback) =>
    (await httpClient.post(`${BASE}/${id}/reject`, { feedback })).data,
}
