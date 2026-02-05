import React, { useState } from 'react'
import {
  Avatar,
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
  ModalProps,
  TextInput
} from 'flowbite-react'
import { HiChevronRight, HiSearch } from 'react-icons/hi'
import { useGlobalSearch } from '~/ui/hooks'
import { Link } from 'react-router'

type GlobalSearchModalProps = ModalProps

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = (props) => {
  const [value, setValue] = useState<string>('')

  const { data, isFetching, isError } = useGlobalSearch(value)

  const onChange = (evt: any) => {
    setValue(evt.target.value)
  }

  return (
    <Modal dismissible {...props}>
      <ModalHeader>
        <div className="max-w-md">
          <TextInput
            type="search"
            icon={HiSearch}
            sizing="sm"
            placeholder="Buscar pets e tutores por nome"
            autoFocus
            autoComplete="no"
            autoCorrect="no"
            onInput={onChange}
          />
        </div>
      </ModalHeader>
      <ModalBody className="min-h-75">
        <div className="space-y-2">
          {!value && (
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Procure por <b className="text-white">pets</b> e{' '}
              <b className="text-white">tutores</b> buscando por seus nomes
            </p>
          )}
          {value &&
            !data?.tutors.length &&
            !data?.pets.length &&
            !isFetching && (
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Nenhum resultado encontrado para "{value}"
              </p>
            )}

          {isError && (
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Erro ao executar busca
            </p>
          )}

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.pets.map((pet) => (
              <li className="py-3 sm:py-4" key={`pet-${pet.id}`}>
                <Link to={`/pets/${pet.id}`}>
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
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <Badge color="gray">PET</Badge>

                      <HiChevronRight />
                    </div>
                  </div>
                </Link>
              </li>
            ))}

            {data?.tutors.map((tutor) => (
              <li className="py-3 sm:py-4" key={`tutor-${tutor.id}`}>
                <Link to={`/tutores/${tutor.id}`}>
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <Avatar
                        img={tutor.foto?.url}
                        placeholderInitials={
                          !tutor.foto ? tutor.nome.charAt(0) : undefined
                        }
                        bordered
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {tutor.nome}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {tutor.email}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <Badge color="gray">TUTOR</Badge>

                      <HiChevronRight />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default GlobalSearchModal
