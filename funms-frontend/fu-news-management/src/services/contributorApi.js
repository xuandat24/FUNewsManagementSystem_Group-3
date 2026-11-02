// Contributor API - always send the JWT saved by LoginComponent.
const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1') + '/contributor/articles'

async function request(path = '', method = 'GET', body) {
  const token = localStorage.getItem('token')
  const response = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Không thể thực hiện yêu cầu')
  return data
}

export const contributorApi = {
  list: () => request(),
  get: (id) => request(`/${id}`),
  create: (body) => request('', 'POST', body),
  update: (id, body) => request(`/${id}`, 'PUT', body),
  submit: (id) => request(`/${id}/submit`, 'POST'),
}
