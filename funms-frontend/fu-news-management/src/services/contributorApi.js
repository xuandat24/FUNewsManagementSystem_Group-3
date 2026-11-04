import httpClient from './httpClient.js'

const BASE = '/contributor/articles'

export const contributorApi = {
  list: async () => (await httpClient.get(BASE)).data,
  get: async (id) => (await httpClient.get(`${BASE}/${id}`)).data,
  create: async (body) => (await httpClient.post(BASE, body)).data,
  update: async (id, body) => (await httpClient.put(`${BASE}/${id}`, body)).data,
  submit: async (id) => (await httpClient.post(`${BASE}/${id}/submit`)).data,
}
