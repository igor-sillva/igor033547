import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import Create from './index'
import * as hooks from '~/ui/hooks'

const mutateMock = vi.fn()
const navigateMock = vi.fn()

vi.mock('~/ui/hooks', () => ({
  useCreatePet: () => ({
    mutate: mutateMock,
    isLoading: false
  })
}))

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock
}))

describe('Create Pet Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o formulário corretamente', () => {
    render(<Create />)

    expect(
      screen.getByRole('heading', { name: /registrar pet/i })
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/raça/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/idade/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeEnabled()
  })

  it('não envia o formulário se estiver inválido', async () => {
    render(<Create />)

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(mutateMock).not.toHaveBeenCalled()
    })
  })

  it('envia o formulário com dados válidos', async () => {
    render(<Create />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Rex' }
    })

    fireEvent.change(screen.getByLabelText(/raça/i), {
      target: { value: 'Vira-lata' }
    })

    fireEvent.change(screen.getByLabelText(/idade/i), {
      target: { value: '5' }
    })

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledTimes(1)
    })

    const payload = mutateMock.mock.calls[0][0]

    expect(payload).toMatchObject({
      nome: 'Rex',
      raca: 'Vira-lata',
      idade: 5
    })
  })

  it('navega para a página do pet após sucesso', async () => {
    mutateMock.mockImplementation((_data, options) => {
      options.onSuccess({ id: 123 })
    })

    render(<Create />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Rex' }
    })

    fireEvent.change(screen.getByLabelText(/raça/i), {
      target: { value: 'Vira-lata' }
    })

    fireEvent.change(screen.getByLabelText(/idade/i), {
      target: { value: '5' }
    })

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/pets/123')
    })
  })

  it('desabilita o botão quando está carregando', () => {
    vi.spyOn(hooks, 'useCreatePet').mockReturnValue({
      mutate: mutateMock,
      isLoading: true
    } as any)

    render(<Create />)

    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeDisabled()
  })
})
