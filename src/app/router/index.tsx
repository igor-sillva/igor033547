import { createBrowserRouter } from 'react-router'
import DefaultLayout from '~/app/layouts/DefaultLayout'
import HomePage from '~/ui/pages/Home/HomePage'

const routes = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'pets/:petId',
        lazy: {
          Component: async () =>
            (await import('~/ui/pages/Pets/DetailPetPage')).default
        }
      }
    ],
    element: <DefaultLayout />
  }
])

export default routes
