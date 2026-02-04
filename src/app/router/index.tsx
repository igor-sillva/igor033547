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
        }
      },
      {
        path: 'pets/:petId',
        lazy: {
          Component: async () => (await import('~/ui/pages/pets/Pets')).default
        }
      },
      {
        path: 'pets/registrar',
        lazy: {
          Component: async () =>
            (await import('~/ui/pages/pets/Create')).default
        }
      },
      {
        path: 'tutores',
        lazy: {
          Component: async () =>
            (await import('~/ui/pages/tutors/Tutors')).default
        }
      }
    ],
    element: <DefaultLayout />
  }
])

export default routes
