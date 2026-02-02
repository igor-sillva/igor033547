import { apiClient } from '~/services/apiClient'

async function doLogin(username: string, password: string) {
  const { data } = await apiClient.post('/autenticacao/login', {
    username,
    password
  })

  return data
}

async function refreshToken(refreshToken: string) {
  const { data } = await apiClient.put('/autenticacao/refresh', null, {
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
