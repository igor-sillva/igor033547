import React, { PropsWithChildren } from 'react'
import { Provider } from 'jotai'
import { store } from '~/app/stores'

const JotaiProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default JotaiProvider
