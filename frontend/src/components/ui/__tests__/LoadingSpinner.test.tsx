import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('animate-spin', 'h-6', 'w-6', 'text-primary-600')
  })

  it('should render with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />)

    expect(screen.getByText('Please wait...')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('h-4', 'w-4')
    expect(svg).not.toHaveClass('h-6', 'w-6', 'h-8', 'w-8')
  })

  it('should render with medium size (default)', () => {
    render(<LoadingSpinner size="md" />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('h-6', 'w-6')
    expect(svg).not.toHaveClass('h-4', 'w-4', 'h-8', 'w-8')
  })

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('h-8', 'w-8')
    expect(svg).not.toHaveClass('h-4', 'w-4', 'h-6', 'w-6')
  })

  it('should have proper SVG attributes', () => {
    render(<LoadingSpinner />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('should have proper container classes', () => {
    render(<LoadingSpinner />)

    const container = screen.getByText('Loading...').closest('.flex.items-center.justify-center.py-12')
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'py-12')
  })

  it('should have proper inner container classes', () => {
    render(<LoadingSpinner />)

    const innerContainer = screen.getByText('Loading...').closest('.flex.items-center.gap-3')
    expect(innerContainer).toHaveClass('flex', 'items-center', 'gap-3')
  })

  it('should have proper text classes', () => {
    render(<LoadingSpinner />)

    const text = screen.getByText('Loading...')
    expect(text).toHaveClass('text-lg', 'text-gray-600')
  })

  it('should render with empty text', () => {
    render(<LoadingSpinner text="" />)

    const textElement = document.querySelector('span.text-lg.text-gray-600')
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveTextContent('')
  })

  it('should render with long text', () => {
    const longText = 'This is a very long loading text that should still be displayed correctly'
    render(<LoadingSpinner text={longText} />)

    expect(screen.getByText(longText)).toBeInTheDocument()
  })
})
