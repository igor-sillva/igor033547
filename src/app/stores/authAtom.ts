import { atom } from 'jotai'

export type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  expiresIn: number | null
}
export const authAtom = atom<AuthState>({
  accessToken: null,
  refreshToken: null,
  expiresIn: null
})
