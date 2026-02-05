import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import TutorPetManager from './index'
import { PetDto } from '~/business/interfaces'

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

vi.mock('~/ui/components/SearchPet', () => ({
  default: ({ onSelect }: any) => (
    <div>
      <button onClick={() => onSelect(petsMock[0])}>Selecionar Rex</button>
      <button onClick={() => onSelect(petsMock[1])}>Selecionar Thor</button>
      <div>SearchPet Mock</div>
    </div>
  )
}))

describe('TutorPetManager', () => {
  it('renderiza pets e botão de remover', () => {
    const onCreateLink = vi.fn()
    const onRemoveLink = vi.fn()

    render(
      <TutorPetManager
        pets={petsMock}
        onCreateLink={onCreateLink}
        onRemoveLink={onRemoveLink}
      />
    )

    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.getByText('Thor')).toBeInTheDocument()
    expect(screen.getAllByText(/remover tutela/i)).toHaveLength(2)
  })

  it('chama onRemoveLink ao clicar no botão', () => {
    const onCreateLink = vi.fn()
    const onRemoveLink = vi.fn()

    render(
      <TutorPetManager
        pets={petsMock}
        onCreateLink={onCreateLink}
        onRemoveLink={onRemoveLink}
      />
    )

    fireEvent.click(screen.getAllByText(/remover tutela/i)[0])
    expect(onRemoveLink).toHaveBeenCalledWith(petsMock[0])
  })

  it('mostra mensagem quando não há pets', () => {
    const onCreateLink = vi.fn()
    const onRemoveLink = vi.fn()

    render(
      <TutorPetManager
        pets={[]}
        onCreateLink={onCreateLink}
        onRemoveLink={onRemoveLink}
      />
    )

    expect(
      screen.getByText(/este tutor não é responsável por nenhum pet/i)
    ).toBeInTheDocument()
  })

  it('chama onCreateLink ao selecionar pet no SearchPet', () => {
    const onCreateLink = vi.fn()
    const onRemoveLink = vi.fn()

    render(
      <TutorPetManager
        pets={[]}
        onCreateLink={onCreateLink}
        onRemoveLink={onRemoveLink}
      />
    )

    fireEvent.click(screen.getByText('Selecionar Rex'))
    expect(onCreateLink).toHaveBeenCalledWith(petsMock[0])
  })
})
