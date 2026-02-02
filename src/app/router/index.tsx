import { createBrowserRouter } from 'react-router'
import DefaultLayout from '~/app/layouts/DefaultLayout'
import HomePage from '~/modules/home/pages/HomePage'

const routes = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'pets',
        lazy: {
          Component: async () =>
            (await import('~/modules/pets/pages/PetsPage')).default
        },
        children: [
          {
            path: ':petId',
            lazy: {
              Component: async () =>
                (await import('~/modules/pets/pages/DetailPetPage')).default
            }
          }
        ]
      }
    ],
    element: <DefaultLayout />
  }
])

export default routes
