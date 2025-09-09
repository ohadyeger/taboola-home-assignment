import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AuthForm } from '../AuthForm'
import { AuthMode } from '../../../types'

describe('AuthForm', () => {
  const defaultProps = {
    mode: 'login' as AuthMode,
    email: '',
    password: '',
    loading: false,
    onEmailChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onModeChange: vi.fn(),
    onSubmit: vi.fn(),
    onErrorDismiss: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form correctly', () => {
    render(<AuthForm {...defaultProps} />)

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to access your dashboard')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Need an account? Register' })).toBeInTheDocument()
  })

  it('should render register form correctly', () => {
    render(<AuthForm {...defaultProps} mode="register" />)

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByText('Get started with your analytics')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Have an account? Sign In' })).toBeInTheDocument()
  })

  it('should display email and password values', () => {
    render(<AuthForm {...defaultProps} email="test@example.com" password="password123" />)

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument()
  })

  it('should call onEmailChange when email input changes', () => {
    render(<AuthForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } })

    expect(defaultProps.onEmailChange).toHaveBeenCalledWith('new@example.com')
  })

  it('should call onPasswordChange when password input changes', () => {
    render(<AuthForm {...defaultProps} />)

    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } })

    expect(defaultProps.onPasswordChange).toHaveBeenCalledWith('newpassword')
  })

  it('should call onSubmit when form is submitted', () => {
    render(<AuthForm {...defaultProps} />)

    const form = screen.getByRole('form')
    fireEvent.submit(form)

    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('should call onModeChange when mode toggle button is clicked', () => {
    render(<AuthForm {...defaultProps} />)

    const toggleButton = screen.getByRole('button', { name: 'Need an account? Register' })
    fireEvent.click(toggleButton)

    expect(defaultProps.onModeChange).toHaveBeenCalledWith('register')
  })

  it('should show loading state on submit button', () => {
    render(<AuthForm {...defaultProps} loading={true} />)

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    expect(submitButton).toBeDisabled()
  })

  it('should display error message when error is provided', () => {
    const errorMessage = 'Invalid credentials'
    render(<AuthForm {...defaultProps} error={errorMessage} />)

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('should not display error message when error is not provided', () => {
    render(<AuthForm {...defaultProps} />)

    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
  })

  it('should have required attributes on inputs', () => {
    render(<AuthForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
  })

  it('should have proper placeholders', () => {
    render(<AuthForm {...defaultProps} />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email')
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password')
  })

  it('should change button text based on mode', () => {
    const { rerender } = render(<AuthForm {...defaultProps} mode="login" />)
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()

    rerender(<AuthForm {...defaultProps} mode="register" />)
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('should change toggle button text based on mode', () => {
    const { rerender } = render(<AuthForm {...defaultProps} mode="login" />)
    expect(screen.getByRole('button', { name: 'Need an account? Register' })).toBeInTheDocument()

    rerender(<AuthForm {...defaultProps} mode="register" />)
    expect(screen.getByRole('button', { name: 'Have an account? Sign In' })).toBeInTheDocument()
  })

  it('should have proper CSS classes', () => {
    render(<AuthForm {...defaultProps} />)

    const card = screen.getByText('Welcome Back').closest('.card')
    expect(card).toBeInTheDocument()

    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveClass('input-field')

    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveClass('input-field')
  })
})
