import { useCallback, useEffect } from 'react'
import { authAtom } from '~/app/stores/authAtom'
import { useAtom } from 'jotai'
import { AuthService } from '~/business/services/authService'
import { PET_PASSWORD, PET_USERNAME } from '~/app/config'

export const useAuthProvider = () => {
  const [token, setToken] = useAtom(authAtom)

  const doLogin = useCallback(async () => {
    const data = await AuthService.doLogin(PET_USERNAME, PET_PASSWORD)

    setToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    })
  }, [token])

  useEffect(() => {
    if (token.accessToken) return

    doLogin().then(Boolean)
  }, [])

  return { token }
}
