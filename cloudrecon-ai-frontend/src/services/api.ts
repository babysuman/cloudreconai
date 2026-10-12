import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ baseURL: BASE, timeout: 300000 })

