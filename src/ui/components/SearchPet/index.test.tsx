import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import SearchPet from './index'
import { PetDto } from '~/business/interfaces'
import * as hooks from '~/ui/hooks'

const petsMock: PetDto[] = [
  { id: 1, nome: 'Rex', raca: 'Vira-lata', idade: 5, foto: null },
  {
    id: 2,
    nome: 'Thor',
    raca: 'Pastor',
    idade: 3,
    foto: { id: 1, nome: 'img', contentType: 'image/png', url: 'img.png' }
  }
]

describe('SearchPet', () => {
  it('renderiza input e resultados filtrados', () => {
    vi.spyOn(hooks, 'useFilterPetsByName').mockReturnValue({
      data: { content: petsMock }
    } as any)

    const onSelect = vi.fn()

    render(<SearchPet onSelect={onSelect} unselectablePets={[]} />)

    const input = screen.getByPlaceholderText(/buscar pet pelo nome/i)
    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Rex' } })
    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Thor')).toBeInTheDocument()
  })

  it('chama onSelect ao clicar em um pet', () => {
    vi.spyOn(hooks, 'useFilterPetsByName').mockReturnValue({
      data: { content: petsMock }
    } as any)

    const onSelect = vi.fn()
    render(<SearchPet onSelect={onSelect} unselectablePets={[]} />)

    fireEvent.click(screen.getByText('Rex'))
    expect(onSelect).toHaveBeenCalledWith(petsMock[0])
  })

  it('não exibe pets bloqueados', () => {
    vi.spyOn(hooks, 'useFilterPetsByName').mockReturnValue({
      data: { content: petsMock }
    } as any)

    const onSelect = vi.fn()
    render(<SearchPet onSelect={onSelect} unselectablePets={[petsMock[0]]} />)

    expect(screen.queryByText('Rex')).not.toBeInTheDocument()
    expect(screen.getByText('Thor')).toBeInTheDocument()
  })
})
