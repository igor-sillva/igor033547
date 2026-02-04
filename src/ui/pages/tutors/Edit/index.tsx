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
import { Link, useNavigate } from 'react-router'
import {
  Avatar,
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
import { HiChevronRight } from 'react-icons/hi'
import TutorPetManager from '~/ui/components/TutorPetManager'
import { PetDto } from '~/business/interfaces'

interface TutorForm {
  nome?: string
  cpf?: string
  email?: string
  telefone?: string
  endereco?: string
}

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
    values: {
      nome: data?.nome,
      cpf: data?.cpf,
      email: data?.email,
      telefone: data?.telefone,
      endereco: data?.endereco
    }
  })

  const handleRemoveTutor = () => {
    removeTutor.mutate()
    navigate('/tutores')
  }

  const onSubmitTutorForm = (formData: TutorForm) => {
    updateTutor.mutate(formData)
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

        {!data ? (
          <p className="p-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Nenhum dado recuperado
          </p>
        ) : (
          <form
            id="edit-tutor"
            className="grid gap-6 p-4 md:grid-cols-2"
            onSubmit={tutorForm.handleSubmit(onSubmitTutorForm)}
          >
            <Card className="md:col-span-2">
              <h2 className="text-xl font-semibold dark:text-white">
                Foto do Tutor
              </h2>

              <div>
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

              <div className="flex justify-start md:col-span-2">
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

            <Card className="md:col-span-2">
              <h2 className="text-xl font-semibold dark:text-white">
                Dados do Tutor
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <FloatingLabel
                    variant="outlined"
                    label="Nome"
                    {...tutorForm.register('nome', { required: true })}
                  />
                </div>
                <div>
                  <FloatingLabel
                    variant="outlined"
                    label="CPF"
                    {...tutorForm.register('cpf', { required: true })}
                  />
                </div>
                <div>
                  <FloatingLabel
                    variant="outlined"
                    label="E-mail"
                    type="email"
                    {...tutorForm.register('email', { required: true })}
                  />
                </div>
                <div>
                  <FloatingLabel
                    variant="outlined"
                    label="Telefone"
                    type="tel"
                    {...tutorForm.register('telefone', { required: true })}
                  />
                </div>
                <div>
                  <FloatingLabel
                    variant="outlined"
                    label="Endereço"
                    {...tutorForm.register('endereco', { required: true })}
                  />
                </div>
              </div>
            </Card>
          </form>
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
