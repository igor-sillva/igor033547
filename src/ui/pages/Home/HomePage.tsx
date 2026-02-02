import React from 'react'
import PetsPage from '~/ui/pages/Pets/PetsPage'
import TutorsPage from '~/ui/pages/Tutors/TutorsPage'
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
