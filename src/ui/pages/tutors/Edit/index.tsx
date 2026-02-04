import React from 'react'
import {
  useAddTutorImage,
  useCreateLinkTutorToPet,
  useRemoveLinkTutorAndPet,
  useRemoveTutor,
  useRemoveTutorImage,
  useTutor,
  useUpdateTutor
} from '~/ui/hooks'
import { useNavigate } from 'react-router'
import {
  Card,
  FileInput,
  FloatingLabel,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'flowbite-react'
import { useForm } from 'react-hook-form'
import TutorPetManager from '~/ui/components/TutorPetManager'
import { PetDto } from '~/business/interfaces'
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
}

const schema = yup.object().shape({
  nome: yup.string().required(),
  cpf: yup
    .string()
    .test('cpf', (value) => validateCPF(value))
    .required(),
  email: yup
    .string()
    .test('email', (value) => validateEmail(value))
    .required(),
  telefone: yup
    .string()
    .test('telefone', (value) => validatePhone(value))
    .required(),
  endereco: yup.string().required()
})

type EditProps = {
  tutorId: number
  show?: boolean
  onClose?: () => void
}
const Edit: React.FC<EditProps> = ({ tutorId, show, onClose }) => {
  const navigate = useNavigate()

  const { data, isLoading, isError } = useTutor(tutorId)
  const updateTutor = useUpdateTutor(tutorId)
  const removeTutor = useRemoveTutor(tutorId)
  const addTutorImage = useAddTutorImage(tutorId)
  const removeTutorImage = useRemoveTutorImage(tutorId)
  const createLinkToPet = useCreateLinkTutorToPet(tutorId)
  const removeLinkWithPet = useRemoveLinkTutorAndPet(tutorId)

  const tutorForm = useForm<TutorForm>({
    mode: 'all',
    values: {
      nome: String(data?.nome),
      cpf: String(data?.cpf),
      email: String(data?.email),
      telefone: String(data?.telefone),
      endereco: String(data?.endereco)
    },
    resolver: yupResolver(schema)
  })

  const handleRemoveTutor = () => {
    removeTutor.mutate()
    navigate('/tutores')
  }

  const onSubmitTutorForm = (formData: TutorForm) => {
    updateTutor.mutate({
      ...formData,
      cpf: onlyNumbers(formData.cpf),
      telefone: onlyNumbers(formData.telefone)
    })
  }

  const handleRemoveTutorImage = () => {
    if (data?.foto) removeTutorImage.mutate(data.foto.id)
  }

  const handleUploadTutorImage = (evt: any) => {
    const file = evt.target.files
    addTutorImage.mutate(file?.[0])
  }

  const handleCreateLinkWithPet = (pet: PetDto) => {
    createLinkToPet.mutate(pet.id)
  }

  const handleRemoveLinkWithPet = (pet: PetDto) => {
    removeLinkWithPet.mutate(pet.id)
  }

  return (
    <Modal dismissible show={show} onClose={onClose}>
      <ModalHeader>Tutor #{tutorId}</ModalHeader>

      <ModalBody>
        {isLoading && (
          <p className="p-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Carregando...
          </p>
        )}

        {isError && (
          <p className="p-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Erro ao carregar Pet
          </p>
        )}

        {data && (
          <>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
              {data.nome}
            </h1>
            <form
              id="edit-tutor"
              className="grid gap-6 md:grid-cols-2"
              onSubmit={tutorForm.handleSubmit(onSubmitTutorForm)}
            >
              <Card className="md:col-span-1">
                <h2 className="text-xl font-semibold dark:text-white">
                  Dados do Tutor
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FloatingLabel
                      variant="outlined"
                      label="Nome"
                      {...tutorForm.register('nome', { required: true })}
                      color={
                        tutorForm.formState.errors.nome ? 'error' : 'default'
                      }
                    />
                  </div>
                  <div>
                    <InputMask
                      mask="999.999.999-99"
                      {...tutorForm.register('cpf', { required: true })}
                    >
                      {(inputProps: any) => (
                        <FloatingLabel
                          {...inputProps}
                          variant="outlined"
                          label="CPF"
                          color={
                            tutorForm.formState.errors.cpf ? 'error' : 'default'
                          }
                        />
                      )}
                    </InputMask>
                  </div>
                  <div>
                    <FloatingLabel
                      variant="outlined"
                      label="E-mail"
                      type="email"
                      {...tutorForm.register('email', { required: true })}
                      color={
                        tutorForm.formState.errors.email ? 'error' : 'default'
                      }
                    />
                  </div>
                  <div>
                    <InputMask
                      mask="(99) 99999-9999"
                      {...tutorForm.register('telefone', { required: true })}
                    >
                      {(inputProps: any) => (
                        <FloatingLabel
                          {...inputProps}
                          variant="outlined"
                          label="Telefone"
                          color={
                            tutorForm.formState.errors.telefone
                              ? 'error'
                              : 'default'
                          }
                        />
                      )}
                    </InputMask>
                  </div>
                  <div>
                    <FloatingLabel
                      variant="outlined"
                      label="Endereço"
                      {...tutorForm.register('endereco', { required: true })}
                      color={
                        tutorForm.formState.errors.cpf ? 'error' : 'default'
                      }
                    />
                  </div>
                </div>
              </Card>

              <Card className="md:col-span-1">
                <h2 className="text-center text-xl font-semibold dark:text-white">
                  Foto do Tutor
                </h2>

                <div className="flex justify-center">
                  {data?.foto ? (
                    <img
                      src={data?.foto.url}
                      alt="pet"
                      className="mb-2 h-32 rounded"
                    />
                  ) : (
                    <FileInput
                      onChange={handleUploadTutorImage}
                      disabled={addTutorImage.isLoading}
                    />
                  )}
                </div>

                <div className="flex justify-center">
                  {data?.foto && (
                    <Button
                      color="red"
                      disabled={removeTutorImage.isLoading}
                      onClick={handleRemoveTutorImage}
                    >
                      Remover imagem
                    </Button>
                  )}
                </div>
              </Card>

              <Card className="md:col-span-2">
                <h2 className="text-xl font-semibold dark:text-white">Pets</h2>

                <TutorPetManager
                  pets={data.pets || []}
                  onCreateLink={handleCreateLinkWithPet}
                  onRemoveLink={handleRemoveLinkWithPet}
                />
              </Card>
            </form>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button
          form="edit-tutor"
          type="submit"
          disabled={updateTutor.isLoading}
        >
          Salvar alterações
        </Button>

        <Button
          color="red"
          outline
          disabled={removeTutor.isLoading}
          onClick={handleRemoveTutor}
        >
          Deletar tutor
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default Edit
