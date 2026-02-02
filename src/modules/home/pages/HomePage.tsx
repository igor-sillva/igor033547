import React from 'react'
import PetsPage from '~/modules/pets/pages/PetsPage'
import TutorsPage from '~/modules/tutors/pages/TutorsPage'
import { TabItem, Tabs } from 'flowbite-react'

const HomePage: React.FC = () => {
  return (
    <Tabs aria-label="Gerenciamento de Pets" variant="underline">
      <TabItem title="Pets" active>
        <PetsPage />
      </TabItem>

      <TabItem title="Tutors">
        <TutorsPage />
      </TabItem>
    </Tabs>
  )
}

export default HomePage
