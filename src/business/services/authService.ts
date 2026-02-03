import { apiClient } from '~/business/services/apiClient'
import { AuthResponseDto } from '~/business/interfaces'

async function doLogin(
  username: string,
  password: string
): Promise<AuthResponseDto> {
  const { data } = await apiClient.post('/autenticacao/login', {
    username,
    password
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
