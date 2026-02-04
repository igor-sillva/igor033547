import React from 'react'
import {
  useAddPetImage,
  usePet,
  useRemovePet,
  useRemovePetImage,
  useUpdatePet
} from '~/ui/hooks'
import { useForm } from 'react-hook-form'
import { Avatar, Button, Card, FileInput, FloatingLabel } from 'flowbite-react'
import { Link, useNavigate } from 'react-router'
import { HiChevronRight } from 'react-icons/hi'

interface PetForm {
  nome?: string
  raca?: string
  idade?: number
}

type EditProps = {
  petId: number
}

const Edit: React.FC<EditProps> = ({ petId }) => {
  const { data, isLoading, isError } = usePet(Number(petId))
  const updatePet = useUpdatePet(Number(petId))
  const removePet = useRemovePet(Number(petId))
  const removePetImage = useRemovePetImage(Number(petId))
  const addPetImage = useAddPetImage(Number(petId))

  const navigate = useNavigate()

  const petForm = useForm<PetForm>({
    values: {
      nome: data?.nome,
      raca: data?.raca,
      idade: data?.idade
    }
  })

  if (isLoading) {
    return (
      <p className="p-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Carregando...
      </p>
    )
  }

  if (isError) {
    return (
      <p className="p-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Erro ao carregar Pet
      </p>
    )
  }

  if (!data) {
    return (
      <p className="p-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Nenhum dado recuperado
      </p>
    )
  }

  const onSubmitPetForm = (formData: PetForm) => {
    updatePet.mutate(formData)
  }

  const handleRemovePet = () => {
    removePet.mutate()
    navigate('/pets')
  }

  const handleRemovePetImage = () => {
    removePetImage.mutate(data.foto.id)
  }

  const handleUploadImage = (evt: any) => {
    const file = evt.target.files
    addPetImage.mutate(file?.[0])
  }

  return (
    <form
      className="grid gap-6 p-4 md:grid-cols-2"
      onSubmit={petForm.handleSubmit(onSubmitPetForm)}
    >
      <Card className="md:col-span-2">
        <h2 className="text-xl font-semibold dark:text-white">Foto do Pet</h2>

        <div>
          {data.foto ? (
            <img src={data.foto.url} alt="pet" className="mb-2 h-32 rounded" />
          ) : (
            <FileInput
              onChange={handleUploadImage}
              disabled={addPetImage.isLoading}
            />
          )}
        </div>

        <div className="flex justify-start md:col-span-2">
          {data.foto && (
            <Button
              color="red"
              disabled={removePetImage.isLoading}
              onClick={handleRemovePetImage}
            >
              Remover imagem
            </Button>
          )}
        </div>
      </Card>

      <Card className="md:col-span-2">
        <h2 className="text-xl font-semibold dark:text-white">Tutores</h2>

        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.tutores?.map((tutor) => (
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
                      <HiChevronRight />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {!data.tutores?.length && (
            <p className="text-gray-900 dark:text-white">
              Nenhum tutor responsável por <b>{data.nome}</b>
            </p>
          )}
        </div>
      </Card>

      <Card className="md:col-span-2">
        <h2 className="text-xl font-semibold dark:text-white">Dados do Pet</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <FloatingLabel
              variant="outlined"
              label="Nome"
              {...petForm.register('nome')}
            />
          </div>
          <div>
            <FloatingLabel
              variant="outlined"
              label="Raça"
              {...petForm.register('raca')}
            />
          </div>
          <div>
            <FloatingLabel
              variant="outlined"
              label="Idade"
              type="number"
              {...petForm.register('idade', { valueAsNumber: true })}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2 md:col-span-2">
        <Button
          color="red"
          disabled={removePet.isLoading}
          onClick={handleRemovePet}
        >
          Deletar pet
        </Button>

        <Button type="submit" disabled={updatePet.isLoading}>
          Salvar alterações
        </Button>
      </div>
    </form>
  )
}

export default Edit
