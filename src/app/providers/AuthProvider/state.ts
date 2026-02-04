import { useCallback, useEffect } from 'react'
import { authAtom } from '~/app/stores/authAtom'
import { useAtom } from 'jotai'
import { AuthService } from '~/business/services/authService'

export const useAuthProvider = () => {
  const [token, setToken] = useAtom(authAtom)

  const doLogin = useCallback(async () => {
    const data = await AuthService.doLogin()

    setToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    })
  }, [token])

  const refreshToken = useCallback(async () => {
    if (!token.refreshToken) return

    const data = await AuthService.refreshToken(token.refreshToken)

    setToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    })
  }, [token.refreshToken])

  useEffect(() => {
    if (token.accessToken) return

    doLogin().then(Boolean)
  }, [])

  useEffect(() => {
    if (!token.expiresIn) return

    const timer = setTimeout(async () => {
      await refreshToken()
    }, token.expiresIn * 1000)

    return () => clearTimeout(timer)
  }, [token.expiresIn])

  return { token }
}
