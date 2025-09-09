import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../Card'

describe('Card', () => {
  it('should render children correctly', () => {
    render(
      <Card>
        <h1>Card Title</h1>
        <p>Card content</p>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should have default CSS classes', () => {
    render(<Card>Test content</Card>)

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow-sm',
      'border',
      'border-gray-200',
      'p-6'
    )
  })

  it('should apply custom className', () => {
    render(<Card className="custom-class">Test content</Card>)

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass('custom-class')
  })

  it('should render with empty className when not provided', () => {
    render(<Card>Test content</Card>)

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm', 'border', 'border-gray-200', 'p-6')
  })

  it('should render complex children', () => {
    render(
      <Card>
        <div>
          <h2>Complex Card</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </Card>
    )

    expect(screen.getByText('Complex Card')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('should render multiple children', () => {
    render(
      <Card>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </Card>
    )

    expect(screen.getByText('First child')).toBeInTheDocument()
    expect(screen.getByText('Second child')).toBeInTheDocument()
    expect(screen.getByText('Third child')).toBeInTheDocument()
  })
})
