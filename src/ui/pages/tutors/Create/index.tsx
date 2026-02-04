import { useForm } from 'react-hook-form'
import { Button, Card, FileInput, FloatingLabel } from 'flowbite-react'
import { useCreateTutor } from '~/ui/hooks'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { validateCPF, validateEmail, validatePhone } from 'validations-br'
import InputMask from 'react-input-mask'
import { onlyNumbers } from '~/utils'

interface TutorForm {
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  foto: FileList | null
}

const schema = yup.object().shape({
  nome: yup.string().required(),
  cpf: yup
    .string()
    .test('cpf', (value) => {
      if (!value) return true
      return validateCPF(value)
    })
    .required(),
  email: yup
    .string()
    .test('email', (value) => {
      if (!value) return true
      return validateEmail(value)
    })
    .required(),
  telefone: yup
    .string()
    .test('telefone', (value) => {
      if (!value) return true
      return validatePhone(value)
    })
    .required(),
  endereco: yup.string().required(),
  foto: yup.mixed<FileList>().notRequired().default(null)
})

export default function Create() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<TutorForm>({
    mode: 'all',
    defaultValues: {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      endereco: '',
      foto: null
    },
    resolver: yupResolver(schema)
  })

  const createTutor = useCreateTutor()

  const onSubmit = (data: TutorForm) => {
    if (!isValid) return

    const payload = {
      ...data,
      cpf: onlyNumbers(data.cpf),
      telefone: onlyNumbers(data.telefone),
      foto: data.foto?.[0]
    }
    createTutor.mutate(payload, {
      onSuccess: (tutor) => goToTutorPath(tutor.id)
    })
  }

  const goToTutorPath = (id: number) => navigate(`/tutores/${id}`)

  return (
    <div className="mx-auto max-w-xl p-4">
      <Card>
        <h1 className="mb-4 text-xl font-semibold dark:text-white">
          Registrar Tutor
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <h5 className="text-md mb-4 font-semibold dark:text-white">Foto</h5>

            <FileInput {...register('foto')} />
          </div>

          <div className="grid gap-4">
            <h5 className="text-md font-semibold dark:text-white">
              Dados pessoais
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
              <InputMask
                mask="999.999.999-99"
                {...register('cpf', { required: true })}
              >
                {(inputProps: any) => (
                  <FloatingLabel
                    {...inputProps}
                    variant="outlined"
                    label="CPF"
                    color={errors.cpf ? 'error' : 'default'}
                  />
                )}
              </InputMask>
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label="E-mail"
                {...register('email', { required: true })}
                color={errors.email ? 'error' : 'default'}
              />
            </div>

            <div>
              <InputMask
                mask="(99) 99999-9999"
                {...register('telefone', { required: true })}
              >
                {(inputProps: any) => (
                  <FloatingLabel
                    {...inputProps}
                    variant="outlined"
                    label="Telefone"
                    color={errors.telefone ? 'error' : 'default'}
                  />
                )}
              </InputMask>
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label="Endereço"
                {...register('endereco', { required: true })}
                color={errors.endereco ? 'error' : 'default'}
              />
            </div>
          </div>

          <Button type="submit" disabled={createTutor.isLoading}>
            Cadastrar
          </Button>
        </form>
      </Card>
    </div>
  )
}
