import React from 'react'
import { AuthMode } from '../../types'
import { Button } from '../ui/Button'

interface AuthFormProps {
  mode: AuthMode
  email: string
  password: string
  loading: boolean
  error?: string
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onModeChange: (mode: AuthMode) => void
  onSubmit: (e: React.FormEvent) => void
  onErrorDismiss?: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onModeChange,
  onSubmit,
  onErrorDismiss
}) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' ? 'Sign in to access your dashboard' : 'Get started with your analytics'}
          </p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              value={email} 
              onChange={e => onEmailChange(e.target.value)} 
              type="email" 
              required 
              className="input-field"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              value={password} 
              onChange={e => onPasswordChange(e.target.value)} 
              type="password" 
              required 
              className="input-field"
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" loading={loading} className="w-full">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            className="w-full" 
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign In'}
          </Button>
        </form>
        
        {error && (
          <div className="mt-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-800">Error: {error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
