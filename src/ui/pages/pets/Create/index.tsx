import { useForm } from 'react-hook-form'
import { Button, Card, FileInput, FloatingLabel } from 'flowbite-react'
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
    formState: { errors, isValid }
  } = useForm<PetForm>({
    mode: 'all'
  })

  const createPet = useCreatePet()

  const onSubmit = (data: PetForm) => {
    if (!isValid) return

    const payload = {
      ...data,
      foto: data.foto?.[0]
    }
    createPet.mutate(payload, {
      onSuccess: (pet) => goToPetPath(pet.id)
    })
  }

  const goToPetPath = (id: number) => navigate(`/pets/${id}`)

  return (
    <div className="mx-auto max-w-xl p-4">
      <Card>
        <h1 className="mb-4 text-xl font-semibold dark:text-white">
          Registrar Pet
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <h5 className="text-md mb-4 font-semibold dark:text-white">Foto</h5>

            <FileInput {...register('foto')} />
          </div>

          <div className="grid gap-4">
            <h5 className="text-md font-semibold dark:text-white">
              Informações do Pet
            </h5>

            <div>
              <FloatingLabel
                variant="outlined"
                label="Nome"
                {...register('nome', { required: true })}
                color={errors.nome ? 'error' : 'default'}
              />
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label="Raça"
                {...register('raca', { required: true })}
                color={errors.nome ? 'error' : 'default'}
              />
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label="Idade"
                type="number"
                {...register('idade', { required: true, valueAsNumber: true })}
                color={errors.nome ? 'error' : 'default'}
              />
            </div>
          </div>

          <Button type="submit" disabled={createPet.isLoading}>
            Cadastrar
          </Button>
        </form>
      </Card>
    </div>
  )
}
