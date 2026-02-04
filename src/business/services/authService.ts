import { AuthResponseDto } from '~/business/interfaces'
import axios from 'axios'
import { PET_API, PET_PASSWORD, PET_USERNAME } from '~/app/config'

const apiClient = axios.create({
  baseURL: PET_API,
  headers: {
    'Content-Type': 'application/json'
  }
})

async function doLogin(): Promise<AuthResponseDto> {
  const { data } = await apiClient.post('/autenticacao/login', {
    username: PET_USERNAME,
    password: PET_PASSWORD
  })

  return data
}

async function refreshToken(refreshToken: string): Promise<AuthResponseDto> {
  const { data } = await apiClient.put('/autenticacao/refresh', undefined, {
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  })

  return data
}

export const AuthService = {
  doLogin,
  refreshToken
}
