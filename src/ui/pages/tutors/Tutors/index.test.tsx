import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import Tutors from './index'
import * as hooks from '~/ui/hooks'

const navigateMock = vi.fn()

const tutorsMock = [
  {
    id: 1,
    nome: 'João',
    email: 'joao@email.com',
    foto: null
  },
  {
    id: 2,
    nome: 'Maria',
    email: 'maria@email.com',
    foto: { url: 'http://image.png' }
  }
]

vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children, next }: any) => (
    <div>
      {children}
      <button onClick={next}>load more</button>
    </div>
  )
}))

vi.mock('~/ui/pages/tutors/Edit', () => ({
  default: ({ tutorId }: any) => <div>Tutor #{tutorId}</div>
}))

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
  useMatch: () => ({ params: { tutorId: 1 } }),
  Link: ({ children }: any) => <>{children}</>
}))

describe('Tutors', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('exibe mensagem de carregando', () => {
    vi.spyOn(hooks, 'useTutors').mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    } as any)

    render(<Tutors />)

    expect(screen.getByText(/carregando tutores/i)).toBeInTheDocument()
  })

  it('exibe erro ao carregar dados', () => {
    vi.spyOn(hooks, 'useTutors').mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    } as any)

    render(<Tutors />)

    expect(screen.getByText(/erro ao carregar tutores/i)).toBeInTheDocument()
  })

  it('renderiza lista de tutores', () => {
    vi.spyOn(hooks, 'useTutors').mockReturnValue({
      data: tutorsMock,
      isLoading: false,
      isError: false,
      hasNextPage: false
    } as any)

    render(<Tutors />)

    expect(screen.getByText('João')).toBeInTheDocument()
    expect(screen.getByText('Maria')).toBeInTheDocument()
  })

  it('carrega mais dados', () => {
    const fetchNextPage = vi.fn()

    vi.spyOn(hooks, 'useTutors').mockReturnValue({
      data: tutorsMock,
      isLoading: false,
      isError: false,
      hasNextPage: true,
      fetchNextPage
    } as any)

    render(<Tutors />)

    fireEvent.click(screen.getByText('load more'))

    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('abre o modal de editar/visualizar pela rota', () => {
    vi.spyOn(hooks, 'useTutors').mockReturnValue({
      data: tutorsMock,
      isLoading: false,
      isError: false,
      hasNextPage: false
    } as any)

    render(<Tutors />)

    expect(screen.getByText('Tutor #1')).toBeInTheDocument()
  })

  it('fecha modal ao navegar para home', () => {
    vi.spyOn(hooks, 'useTutors').mockReturnValue({
      data: tutorsMock,
      isLoading: false,
      isError: false,
      hasNextPage: false
    } as any)

    render(<Tutors />)

    navigateMock('/tutores')

    expect(navigateMock).toHaveBeenCalledWith('/tutores')
  })
})
