import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, beforeEach } from 'vitest'
import GlobalSearchModal from './index'
import * as hooks from '~/ui/hooks'

const searchMock = {
  pets: [
    {
      id: 1,
      nome: 'Rex',
      raca: 'Vira-lata',
      foto: null
    }
  ],
  tutors: [
    {
      id: 2,
      nome: 'João',
      email: 'joao@email.com',
      foto: null
    }
  ]
}

vi.mock('react-router', () => ({
  Link: ({ children }: any) => <>{children}</>
}))

describe('GlobalSearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exibe texto inicial quando vazio', () => {
    vi.spyOn(hooks, 'useGlobalSearch').mockReturnValue({
      data: { pets: [], tutors: [] },
      isFetching: false,
      isError: false
    } as any)

    render(<GlobalSearchModal show onClose={vi.fn()} />)

    expect(screen.getByText(/procure por/i)).toBeInTheDocument()
  })

  it('exibe resultados de pets e tutores', () => {
    vi.spyOn(hooks, 'useGlobalSearch').mockReturnValue({
      data: searchMock,
      isFetching: false,
      isError: false
    } as any)

    render(<GlobalSearchModal show onClose={vi.fn()} />)

    fireEvent.input(screen.getByRole('searchbox'), {
      target: { value: 're' }
    })

    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('João')).toBeInTheDocument()
    expect(screen.getByText('PET')).toBeInTheDocument()
    expect(screen.getByText('TUTOR')).toBeInTheDocument()
  })

  it('exibe mensagem de nenhum resultado', () => {
    vi.spyOn(hooks, 'useGlobalSearch').mockReturnValue({
      data: { pets: [], tutors: [] },
      isFetching: false,
      isError: false
    } as any)

    render(<GlobalSearchModal show onClose={vi.fn()} />)

    fireEvent.input(screen.getByRole('searchbox'), {
      target: { value: 'abc' }
    })

    expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument()
  })

  it('exibe erro de busca', () => {
    vi.spyOn(hooks, 'useGlobalSearch').mockReturnValue({
      data: { pets: [], tutors: [] },
      isFetching: false,
      isError: true
    } as any)

    render(<GlobalSearchModal show onClose={vi.fn()} />)

    fireEvent.input(screen.getByRole('searchbox'), {
      target: { value: 'rex' }
    })

    expect(screen.getByText(/erro ao executar busca/i)).toBeInTheDocument()
  })
})
