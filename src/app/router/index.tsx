import { createBrowserRouter, Navigate } from 'react-router'
import DefaultLayout from '~/app/layouts/DefaultLayout'

const routes = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Navigate to="pets" replace />
      },
      {
        path: 'pets',
        lazy: {
          Component: async () => (await import('~/ui/pages/pets/Pets')).default
        },
        children: [
          {
            path: ':petId',
            lazy: {
              Component: async () =>
                (await import('~/ui/pages/pets/Detail')).default
            }
          }
        ]
      },
      {
        path: 'tutores',
        lazy: {
          Component: async () =>
            (await import('~/ui/pages/tutors/TutorsPage')).default
        }
      }
    ],
    element: <DefaultLayout />
  }
])

export default routes
