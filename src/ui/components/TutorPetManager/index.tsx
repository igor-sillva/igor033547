import React from 'react'
import { PetDto } from '~/business/interfaces'
import SearchPet from '~/ui/components/SearchPet'
import { Avatar, Button } from 'flowbite-react'

type TutorPetManagerProps = {
  pets: PetDto[]
  onCreateLink: (pet: PetDto) => void
  onRemoveLink: (pet: PetDto) => void
}

const TutorPetManager: React.FC<TutorPetManagerProps> = ({
  pets,
  onCreateLink,
  onRemoveLink
}) => {
  return (
    <div className="flex flex-col gap-2">
      <SearchPet onSelect={onCreateLink} unselectablePets={pets} />

      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {pets?.map((pet) => (
            <li className="py-3 sm:py-4" key={`tutor-${pet.id}`}>
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <Avatar
                    img={pet.foto?.url}
                    placeholderInitials={
                      !pet.foto ? pet.nome.charAt(0) : undefined
                    }
                    bordered
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {pet.nome}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {pet.raca}
                  </p>
                </div>
                <div className="inline-flex items-center">
                  <Button
                    outline
                    color="gray"
                    size="sm"
                    onClick={() => onRemoveLink(pet)}
                  >
                    Remover tutela
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {!pets.length && (
          <p className="text-gray-900 dark:text-white">
            Este tutor não é responsável por nenhum pet
          </p>
        )}
      </div>
    </div>
  )
}

export default TutorPetManager
