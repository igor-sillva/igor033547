import { atom } from 'jotai'

export type AuthState = {
  accessToken: string | null
  refreshToken: string | null
}
export const authAtom = atom<AuthState>({
  accessToken: null,
  refreshToken: null
})
