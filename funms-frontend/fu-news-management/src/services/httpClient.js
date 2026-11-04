import axios from 'axios'

// One Axios client for all React pages.
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
})

httpClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// API errors are displayed directly in the form / review dialog.
httpClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message
      || (error.response?.status === 401 ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : null)
      || (error.response?.status === 403 ? 'Bạn không có quyền thực hiện thao tác này.' : null)
      || error.message || 'Không thể kết nối đến máy chủ.'
    return Promise.reject(new Error(message))
  }
)

export default httpClient
