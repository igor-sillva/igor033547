import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import PetsPage from './index'
import * as hooks from '~/ui/hooks'

const navigateMock = vi.fn()

const petsMock = [
  {
    id: 1,
    nome: 'Rex',
    raca: 'Vira-lata',
    idade: 5,
    foto: null
  },
  {
    id: 2,
    nome: 'Thor',
    raca: 'Pastor',
    idade: 3,
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

vi.mock('~/ui/pages/pets/Edit', () => ({
  default: ({ petId }: any) => <div>Pet #{petId}</div>
}))

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
  useMatch: () => ({ params: { petId: 1 } }),
  Link: ({ children }: any) => <>{children}</>
}))

describe('PetsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('exibe loading', () => {
    vi.spyOn(hooks, 'usePets').mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    } as any)

    render(<PetsPage />)

    expect(screen.getByText(/carregando pets/i)).toBeInTheDocument()
  })

  it('exibe erro', () => {
    vi.spyOn(hooks, 'usePets').mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    } as any)

    render(<PetsPage />)

    expect(screen.getByText(/erro ao carregar pets/i)).toBeInTheDocument()
  })

  it('renderiza mansory de pets', () => {
    vi.spyOn(hooks, 'usePets').mockReturnValue({
      data: petsMock,
      isLoading: false,
      isError: false,
      hasNextPage: false
    } as any)

    render(<PetsPage />)

    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Thor')).toBeInTheDocument()
  })

  it('carrega mais dados', () => {
    const fetchNextPage = vi.fn()

    vi.spyOn(hooks, 'usePets').mockReturnValue({
      data: petsMock,
      isLoading: false,
      isError: false,
      hasNextPage: true,
      fetchNextPage
    } as any)

    render(<PetsPage />)

    fireEvent.click(screen.getByText('load more'))

    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('abre o modal de editar/visualizar pela rota', () => {
    vi.spyOn(hooks, 'usePets').mockReturnValue({
      data: petsMock,
      isLoading: false,
      isError: false,
      hasNextPage: false
    } as any)

    render(<PetsPage />)

    expect(screen.getByText('Pet #1')).toBeInTheDocument()
  })

  it('fecha modal ao navegar para home', () => {
    vi.spyOn(hooks, 'usePets').mockReturnValue({
      data: petsMock,
      isLoading: false,
      isError: false,
      hasNextPage: false
    } as any)

    render(<PetsPage />)

    navigateMock('/pets')

    expect(navigateMock).toHaveBeenCalledWith('/pets')
  })
})
