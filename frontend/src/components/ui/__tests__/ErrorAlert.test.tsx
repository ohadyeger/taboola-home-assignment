import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorAlert } from '../ErrorAlert'

describe('ErrorAlert', () => {
  it('should render error message', () => {
    const errorMessage = 'Something went wrong'
    render(<ErrorAlert error={errorMessage} />)

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('should render without dismiss button when onDismiss is not provided', () => {
    render(<ErrorAlert error="Test error" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render with dismiss button when onDismiss is provided', () => {
    const onDismiss = vi.fn()
    render(<ErrorAlert error="Test error" onDismiss={onDismiss} />)

    const dismissButton = screen.getByRole('button')
    expect(dismissButton).toBeInTheDocument()
  })

  it('should call onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn()
    render(<ErrorAlert error="Test error" onDismiss={onDismiss} />)

    const dismissButton = screen.getByRole('button')
    fireEvent.click(dismissButton)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('should have proper CSS classes', () => {
    render(<ErrorAlert error="Test error" />)

    const alert = document.querySelector('.p-4.bg-red-50.border.border-red-200.rounded-lg')
    expect(alert).toHaveClass(
      'p-4',
      'bg-red-50',
      'border',
      'border-red-200',
      'rounded-lg'
    )
  })

  it('should have proper error icon', () => {
    render(<ErrorAlert error="Test error" />)

    const errorIcon = document.querySelector('svg')
    expect(errorIcon).toHaveClass('h-5', 'w-5', 'text-red-400')
    expect(errorIcon).toHaveAttribute('viewBox', '0 0 20 20')
    expect(errorIcon).toHaveAttribute('fill', 'currentColor')
  })

  it('should have proper dismiss icon', () => {
    const onDismiss = vi.fn()
    render(<ErrorAlert error="Test error" onDismiss={onDismiss} />)

    const dismissIcon = document.querySelectorAll('svg')[1]
    expect(dismissIcon).toHaveClass('h-4', 'w-4')
    expect(dismissIcon).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('should have proper text styling', () => {
    render(<ErrorAlert error="Test error" />)

    const errorText = screen.getByText('Error: Test error')
    expect(errorText).toHaveClass('text-sm', 'text-red-800')
  })

  it('should render with empty error message', () => {
    render(<ErrorAlert error="" />)

    expect(screen.getByText(/Error:/)).toBeInTheDocument()
  })

  it('should render with long error message', () => {
    const longError = 'This is a very long error message that should still be displayed correctly and should not break the layout'
    render(<ErrorAlert error={longError} />)

    expect(screen.getByText(`Error: ${longError}`)).toBeInTheDocument()
  })

  it('should have proper dismiss button styling', () => {
    const onDismiss = vi.fn()
    render(<ErrorAlert error="Test error" onDismiss={onDismiss} />)

    const dismissButton = screen.getByRole('button')
    expect(dismissButton).toHaveClass('ml-3', 'text-red-400', 'hover:text-red-600')
  })

  it('should have proper flex layout', () => {
    render(<ErrorAlert error="Test error" />)

    const flexContainer = screen.getByText('Error: Test error').closest('.flex')
    expect(flexContainer).toHaveClass('flex')
  })

  it('should have proper text container styling', () => {
    render(<ErrorAlert error="Test error" />)

    const textContainer = screen.getByText('Error: Test error').closest('.ml-3.flex-1')
    expect(textContainer).toHaveClass('ml-3', 'flex-1')
  })
})
