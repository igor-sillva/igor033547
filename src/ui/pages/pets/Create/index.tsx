import { useForm } from 'react-hook-form'
import {
  Button,
  Card,
  TextInput,
  Label,
  FileInput,
  FloatingLabel
} from 'flowbite-react'
import { useCreatePet } from '~/ui/hooks'
import { useNavigate } from 'react-router'

interface PetForm {
  nome: string
  raca: string
  idade: number
  foto?: FileList
}

export default function Create() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PetForm>()

  const createPet = useCreatePet()

  const onSubmit = (data: PetForm) => {
    const payload = {
      ...data,
      foto: data.foto?.[0]
    }
    createPet.mutate(payload, {
      onSuccess: () => goHome()
    })
  }

  const goHome = () => navigate('/pets')

  return (
    <div className="mx-auto max-w-xl p-4">
      <Card>
        <h1 className="mb-4 text-xl font-semibold dark:text-white">
          Registrar Pet
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <FloatingLabel
              variant="outlined"
              label="Nome"
              {...register('nome', { required: true })}
              color={errors.nome ? 'failure' : 'default'}
            />
          </div>

          <div>
            <FloatingLabel
              variant="outlined"
              label="Raça"
              {...register('raca', { required: true })}
              color={errors.nome ? 'failure' : 'default'}
            />
          </div>

          <div>
            <FloatingLabel
              variant="outlined"
              label="Idade"
              type="number"
              {...register('idade', { required: true, valueAsNumber: true })}
              color={errors.nome ? 'failure' : 'default'}
            />
          </div>

          <div>
            <h5 className="text-md mb-4 font-semibold dark:text-white">
              Adicione uma imagem
            </h5>

            <FileInput {...register('foto')} />
          </div>

          <Button type="submit" disabled={createPet.isLoading}>
            Cadastrar
          </Button>
        </form>
      </Card>
    </div>
  )
}
