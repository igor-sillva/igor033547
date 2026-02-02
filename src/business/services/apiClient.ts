import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { PET_API } from '~/app/config'
import { authAtom, store } from '~/app/stores'
import { AuthService } from '~/business/services/authService'

export const apiClient = axios.create({
  baseURL: PET_API,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = store.get(authAtom)

  if (token.accessToken) {
    config.headers.Authorization = `Bearer ${token.accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const auth = store.get(authAtom)
    if (!auth.refreshToken) {
      return Promise.reject(error)
    }

    try {
      const res = await AuthService.refreshToken(auth.refreshToken)

      store.set(authAtom, {
        accessToken: res.access_token,
        refreshToken: res.refresh_token
      })

      originalRequest.headers!.Authorization = `Bearer ${res.access_token}`

      return apiClient(originalRequest)
    } catch {
      store.set(authAtom, {
        accessToken: null,
        refreshToken: null
      })

      return Promise.reject(error)
    }
  }
)
