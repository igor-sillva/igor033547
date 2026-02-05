import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import CreateTutor from './index'
import * as hooks from '~/ui/hooks'

const mutateMock = vi.fn()
const navigateMock = vi.fn()

vi.mock('~/ui/hooks', () => ({
  useCreateTutor: () => ({
    mutate: mutateMock,
    isLoading: false
  })
}))

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock
}))

describe('CreateTutor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o formulário', () => {
    render(<CreateTutor />)

    expect(screen.getByText(/registrar tutor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument()
  })

  it('não submete com formulário inválido', async () => {
    render(<CreateTutor />)

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(mutateMock).not.toHaveBeenCalled()
    })
  })

  it('submete formulário válido', async () => {
    render(<CreateTutor />)

    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'João Silva' }
    })

    fireEvent.change(screen.getByLabelText(/cpf/i), {
      target: { value: '123.456.789-09' }
    })

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'joao@email.com' }
    })

    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '(11) 91234-5678' }
    })

    fireEvent.change(screen.getByLabelText(/endereço/i), {
      target: { value: 'Rua Teste, 123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled()
    })

    const payload = mutateMock.mock.calls[0][0]

    expect(payload).toMatchObject({
      nome: 'João Silva',
      cpf: '12345678909',
      email: 'joao@email.com',
      telefone: '11912345678',
      endereco: 'Rua Teste, 123',
      foto: undefined
    })
  })

  it('desabilita botão durante loading', () => {
    vi.spyOn(hooks, 'useCreateTutor').mockReturnValue({
      mutate: mutateMock,
      isLoading: true
    } as any)

    render(<CreateTutor />)

    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeDisabled()
  })
})
