import { RouterProvider } from 'react-router'
import router from '~/app/router'
import AuthProvider from '~/app/providers/AuthProvider'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '~/app/config'
import JotaiProvider from '~/app/providers/JotaiProvider'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </JotaiProvider>
    </QueryClientProvider>
  )
}

export default App
