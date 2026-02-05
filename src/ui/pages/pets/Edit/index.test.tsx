import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import Edit from './index'
import * as hooks from '~/ui/hooks'

const navigateMock = vi.fn()

const updateMutate = vi.fn()
const removeMutate = vi.fn()
const removeImageMutate = vi.fn()
const addImageMutate = vi.fn()

const petMock = {
  id: 1,
  nome: 'Rex',
  raca: 'Vira-lata',
  idade: 5,
  foto: {
    id: 10,
    url: 'http://image.png'
  },
  tutores: []
}

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
  Link: ({ children }: any) => <>{children}</>
}))

vi.mock('~/ui/hooks', () => ({
  usePet: () => ({
    data: petMock,
    isLoading: false,
    isError: false
  }),
  useUpdatePet: () => ({
    mutate: updateMutate,
    isLoading: false
  }),
  useRemovePet: () => ({
    mutate: removeMutate,
    isLoading: false
  }),
  useRemovePetImage: () => ({
    mutate: removeImageMutate,
    isLoading: false
  }),
  useAddPetImage: () => ({
    mutate: addImageMutate,
    isLoading: false
  })
}))

describe('Edit Pet Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('exibe loading', () => {
    vi.spyOn(hooks, 'usePet').mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    } as any)

    render(<Edit petId={1} show />)

    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('exibe erro', () => {
    vi.spyOn(hooks, 'usePet').mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    } as any)

    render(<Edit petId={1} show />)

    expect(screen.getByText(/erro ao carregar pet/i)).toBeInTheDocument()
  })

  it('renderiza dados do pet', () => {
    render(<Edit petId={1} show />)

    expect(screen.getAllByText('Rex')[0]).toBeInTheDocument()
    expect(screen.getByDisplayValue('Vira-lata')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('submete o formulário', async () => {
    render(<Edit petId={1} show />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Thor' }
    })

    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))

    await waitFor(() => {
      expect(updateMutate).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'Thor' })
      )
    })
  })

  it('remove o pet e navega', async () => {
    render(<Edit petId={1} show />)

    fireEvent.click(screen.getByRole('button', { name: /deletar pet/i }))

    expect(removeMutate).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/pets')
  })

  it('remove imagem do pet', () => {
    render(<Edit petId={1} show />)

    fireEvent.click(screen.getByRole('button', { name: /remover imagem/i }))

    expect(removeImageMutate).toHaveBeenCalledWith(10)
  })

  it('faz upload de imagem quando não existe foto', () => {
    const addImage = vi.fn()

    vi.spyOn(hooks, 'usePet').mockReturnValue({
      data: { ...petMock, foto: null },
      isLoading: false,
      isError: false
    } as any)

    vi.spyOn(hooks, 'useAddPetImage').mockReturnValue({
      mutate: addImage,
      isLoading: false
    } as any)

    render(<Edit petId={1} show />)

    const file = new File(['img'], 'foto.png', { type: 'image/png' })

    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] }
    })

    expect(addImage).toHaveBeenCalledWith(file)
  })

  it('exibe mensagem quando não há tutores', () => {
    render(<Edit petId={1} show />)

    expect(screen.getByText(/nenhum tutor responsável/i)).toBeInTheDocument()
  })
})
