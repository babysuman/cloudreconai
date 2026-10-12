import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ baseURL: BASE, timeout: 300000 })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('cloudrecon_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

