import React, { PropsWithChildren } from 'react'
import { useAuthProvider } from '~/app/providers/AuthProvider/state'

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthProvider()

  console.log(token)

  if (!token.accessToken) {
    return <div>Carregando...</div>
  }

  return children
}

export default AuthProvider
