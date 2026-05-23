import axios from "axios"
import { API_BASE_URL } from './config'

const API = axios.create({
    baseURL: API_BASE_URL
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear()         
      window.location.href = '/login'  
    }
    return Promise.reject(error)
  }
)

export default API
