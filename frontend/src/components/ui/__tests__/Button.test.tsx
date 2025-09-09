import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('should render button with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('should render disabled button when loading', () => {
    render(<Button loading={true}>Loading...</Button>)

    const button = screen.getByRole('button', { name: 'Loading...' })
    expect(button).toBeDisabled()
  })

  it('should render disabled button when disabled prop is true', () => {
    render(<Button disabled={true}>Disabled</Button>)

    const button = screen.getByRole('button', { name: 'Disabled' })
    expect(button).toBeDisabled()
  })

  it('should render button with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)

    const button = screen.getByRole('button', { name: 'Secondary' })
    expect(button).toBeInTheDocument()
  })

  it('should render button with custom className', () => {
    render(<Button className="custom-class">Custom</Button>)

    const button = screen.getByRole('button', { name: 'Custom' })
    expect(button).toHaveClass('custom-class')
  })

  it('should render button with type submit', () => {
    render(<Button type="submit">Submit</Button>)

    const button = screen.getByRole('button', { name: 'Submit' })
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should render button with type button', () => {
    render(<Button type="button">Button</Button>)

    const button = screen.getByRole('button', { name: 'Button' })
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)

    const button = screen.getByRole('button', { name: 'Clickable' })
    button.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not handle click events when disabled', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled={true}>Disabled</Button>)

    const button = screen.getByRole('button', { name: 'Disabled' })
    button.click()

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should not handle click events when loading', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} loading={true}>Loading</Button>)

    const button = screen.getByRole('button', { name: 'Loading' })
    button.click()

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render children correctly', () => {
    render(
      <Button>
        <span>Icon</span> Text
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Icon Text')
  })

  it('should have proper default classes', () => {
    render(<Button>Default</Button>)

    const button = screen.getByRole('button', { name: 'Default' })
    expect(button).toHaveClass('btn', 'btn-primary')
  })

  it('should have secondary classes when variant is secondary', () => {
    render(<Button variant="secondary">Secondary</Button>)

    const button = screen.getByRole('button', { name: 'Secondary' })
    expect(button).toHaveClass('btn', 'btn-secondary')
  })
})
