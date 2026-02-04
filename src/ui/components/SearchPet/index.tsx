import React, { useState } from 'react'
import { PetDto } from '~/business/interfaces'
import {
  Avatar,
  Badge,
  Button,
  ListGroup,
  ListGroupItem,
  TextInput
} from 'flowbite-react'
import { useFilterPetsByName } from '~/ui/hooks'
import { HiSearch } from 'react-icons/hi'

type SearchPetProps = {
  onSelect: (pet: PetDto) => void
  unselectedPets: PetDto[]
}

const SearchPet: React.FC<SearchPetProps> = ({ onSelect, unselectedPets }) => {
  const [value, setValue] = useState<string>('')

  const { data } = useFilterPetsByName(value, 5)

  const results = (data?.content || []).filter((p) =>
    unselectedPets.some((u) => u.id !== p.id)
  )

  const handleOnSelect = (pet: PetDto) => {
    onSelect(pet)
    setValue('')
  }

  return (
    <div className="grid gap-2">
      <TextInput
        type="search"
        icon={HiSearch}
        sizing="sm"
        placeholder="Buscar pet pelo nome"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {results.length ? (
        <ListGroup>
          {results.map((pet) => (
            <ListGroupItem key={pet.id} onClick={() => handleOnSelect(pet)}>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    img={pet.foto?.url}
                    placeholderInitials={
                      !pet.foto ? pet.nome.charAt(0) : undefined
                    }
                    bordered
                  />
                  <b>{pet.nome}</b>
                  <Badge>{pet.raca}</Badge>
                </div>
                <small>Vincular</small>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      ) : null}
    </div>
  )
}

export default SearchPet
