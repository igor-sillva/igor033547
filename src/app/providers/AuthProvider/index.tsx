import React, { PropsWithChildren } from 'react'
import { useAuthProvider } from '~/app/providers/AuthProvider/state'
import { Spinner } from 'flowbite-react'

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuthProvider()

  if (!token.accessToken) {
    return (
      <div className="flex flex-col p-4">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    )
  }

  return children
}

export default AuthProvider
