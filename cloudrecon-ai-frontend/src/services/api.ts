import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ baseURL: BASE, timeout: 300000 })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('cloudrecon_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const login = (email: string, password: string) => api.post('/auth/login', { email, password })

export async function uploadSatelliteImage(file: File, composite: 'false-color' | 'natural' = 'false-color', reference?: File | null) {
  const form = new FormData()
  form.append('file', file)
  form.append('composite', composite)
  if (reference) form.append('reference', reference)
  return api.post('/images/upload', form)
}
