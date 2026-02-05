import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import CardLink from './index'

vi.mock('react-router', () => ({
  Link: ({ children, to }: any) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  )
}))

describe('CardLink', () => {
  it('renderiza children corretamente', () => {
    render(
      <CardLink to="/teste" imgSrc="image.png">
        <span>Conteúdo</span>
      </CardLink>
    )

    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('aplica o link corretamente', () => {
    render(
      <CardLink to="/rota" imgSrc="image.png">
        Teste
      </CardLink>
    )

    const link = screen.getByTestId('link')
    expect(link).toHaveAttribute('href', '/rota')
  })

  it('executa onClick ao clicar no card', () => {
    const onClick = vi.fn()

    render(
      <CardLink to="/rota" imgSrc="image.png" onClick={onClick}>
        Teste
      </CardLink>
    )

    fireEvent.click(screen.getByText('Teste'))
    expect(onClick).toHaveBeenCalled()
  })

  it('renderiza imagem de background corretamente', () => {
    render(
      <CardLink to="/rota" imgSrc="foto.jpg">
        Teste
      </CardLink>
    )

    const imageDiv = document.querySelector('.card-image') as HTMLElement
    expect(imageDiv.style.backgroundImage).toContain('foto.jpg')
  })
})
