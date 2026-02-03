import React from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  useAddPetImage,
  usePet,
  useRemovePetImage,
  useUpdatePet,
  useUpdatePetAndChangePhoto
} from '~/ui/hooks'
import { useForm } from 'react-hook-form'
import { Button, Card, FileInput, FloatingLabel, Label } from 'flowbite-react'
import { CustomEvent } from 'happy-dom'

interface PetForm {
  nome: string
  raca: string
  idade: number
}

interface PetImageForm {
  foto: FileList
}

const Edit: React.FC = () => {
  const { petId } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = usePet(Number(petId))
  const updatePet = useUpdatePet(Number(petId))
  const removePetImage = useRemovePetImage(Number(petId))
  const addPetImage = useAddPetImage(Number(petId))

  const petForm = useForm<PetForm>({
    values: {
      nome: data?.nome,
      raca: data?.raca,
      idade: data?.idade
    }
  })

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (isError) {
    return <div>Erro ao carregar Pet</div>
  }

  if (!data) {
    return <div>Nenhum dado recuperado</div>
  }

  const onSubmitPetForm = (formData: PetForm) => {
    updatePet.mutate(formData)
  }

  const handleRemovePetImage = () => {
    removePetImage.mutate(data.foto.id)
  }

  const handleUploadImage = (event: unknown) => {
    const file = event.target.files
    addPetImage.mutate(file?.[0])
  }

  const goBack = () => navigate('/pets')

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

        <div className="flex justify-end gap-2 md:col-span-2">
          <Button color="alternative" onClick={goBack}>
            Cancelar
          </Button>

          <Button type="submit" disabled={updatePet.isLoading}>
            Salvar alterações
          </Button>
        </div>
      </Card>
    </form>
  )
}

export default Edit
