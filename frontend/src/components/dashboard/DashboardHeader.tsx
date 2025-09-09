import React from 'react'
import { Button } from '../ui/Button'

interface DashboardHeaderProps {
  onRefresh: () => void
  onLogout: () => void
  loading: boolean
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onLogout,
  loading
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Ad Metrics Dashboard</h2>
        <p className="text-gray-600 mt-1">Monitor and analyze your advertising performance</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onRefresh} 
          disabled={loading} 
          variant="secondary"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          Refresh
        </Button>
        <Button 
          onClick={onLogout} 
          variant="secondary"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
