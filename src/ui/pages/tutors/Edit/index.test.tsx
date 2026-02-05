import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import EditTutor from './index'
import * as hooks from '~/ui/hooks'
import { MemoryRouter } from 'react-router'

const updateMutate = vi.fn()
const removeMutate = vi.fn()
const addImageMutate = vi.fn()
const removeImageMutate = vi.fn()
const createLinkMutate = vi.fn()
const removeLinkMutate = vi.fn()

const tutorMock = {
  id: 1,
  nome: 'João Silva',
  cpf: '123.456.789-09',
  email: 'joao@email.com',
  telefone: '(11) 91234-5678',
  endereco: 'Rua A',
  foto: { id: 10, url: 'http://image.png' },
  pets: [{ id: 2, nome: 'Rex' }]
}

vi.mock('~/ui/components/TutorPetManager', () => ({
  default: ({ pets, onCreateLink, onRemoveLink }: any) => (
    <div>
      {pets.map((p: any) => (
        <div key={p.id}>
          <span>{p.nome}</span>
          <button onClick={() => onRemoveLink(p)}>remover</button>
        </div>
      ))}
      <button onClick={() => onCreateLink({ id: 99 })}>adicionar</button>
    </div>
  )
}))

describe('Edição de Tutor', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(hooks, 'useTutor').mockReturnValue({
      data: tutorMock,
      isLoading: false,
      isError: false
    } as any)

    vi.spyOn(hooks, 'useUpdateTutor').mockReturnValue({
      mutate: updateMutate,
      isLoading: false
    } as any)

    vi.spyOn(hooks, 'useRemoveTutor').mockReturnValue({
      mutate: removeMutate,
      isLoading: false
    } as any)

    vi.spyOn(hooks, 'useAddTutorImage').mockReturnValue({
      mutate: addImageMutate,
      isLoading: false
    } as any)

    vi.spyOn(hooks, 'useRemoveTutorImage').mockReturnValue({
      mutate: removeImageMutate,
      isLoading: false
    } as any)

    vi.spyOn(hooks, 'useCreateLinkTutorToPet').mockReturnValue({
      mutate: createLinkMutate
    } as any)

    vi.spyOn(hooks, 'useRemoveLinkTutorAndPet').mockReturnValue({
      mutate: removeLinkMutate
    } as any)
  })

  it('exibe carregando dados', () => {
    vi.spyOn(hooks, 'useTutor').mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    } as any)

    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('exibe erro ao carregar tutor', () => {
    vi.spyOn(hooks, 'useTutor').mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    } as any)

    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument()
  })

  it('renderiza dados do tutor', () => {
    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByLabelText(/nome/i)).toHaveValue('João Silva')
    expect(screen.getByLabelText(/cpf/i)).toHaveValue('123.456.789-09')
  })

  it('submete alterações do tutor', async () => {
    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Atualizado' }
    })

    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => {
      expect(updateMutate).toHaveBeenCalled()
    })

    const payload = updateMutate.mock.calls[0][0]

    expect(payload).toMatchObject({
      nome: 'João Atualizado',
      cpf: '12345678909',
      telefone: '11912345678'
    })
  })

  it('remove tutor ao clicar em deletar', () => {
    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /deletar tutor/i }))

    expect(removeMutate).toHaveBeenCalled()
  })

  it('remove imagem do tutor', () => {
    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /remover imagem/i }))

    expect(removeImageMutate).toHaveBeenCalledWith(10)
  })

  it('adiciona vínculo com pet', () => {
    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('adicionar'))

    expect(createLinkMutate).toHaveBeenCalledWith(99)
  })

  it('remove vínculo com pet', () => {
    render(
      <MemoryRouter>
        <EditTutor tutorId={1} show />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('remover'))

    expect(removeLinkMutate).toHaveBeenCalledWith(2)
  })
})
