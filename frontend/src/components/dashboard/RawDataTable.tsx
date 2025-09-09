import React from 'react'
import { AdMetrics } from '../../types'
import { Card } from '../ui/Card'
import { Pagination } from '../ui/Pagination'

interface RawDataTableProps {
  adMetrics: AdMetrics[]
  pagination: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalElements: number
  }
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export const RawDataTable: React.FC<RawDataTableProps> = ({
  adMetrics,
  pagination,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900">Raw Data</h3>
        <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">Admin Only</span>
      </div>
      
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="table-cell text-left font-semibold">Day</th>
              <th className="table-cell text-left font-semibold">Campaign</th>
              <th className="table-cell text-left font-semibold">Country</th>
              <th className="table-cell text-left font-semibold">Platform</th>
              <th className="table-cell text-left font-semibold">Browser</th>
              <th className="table-cell text-right font-semibold">Spent</th>
              <th className="table-cell text-right font-semibold">Impressions</th>
              <th className="table-cell text-right font-semibold">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {adMetrics.map((ad, i) => (
              <tr key={i} className="table-row">
                <td className="table-cell">{ad.day}</td>
                <td className="table-cell">{ad.campaign}</td>
                <td className="table-cell">{ad.country}</td>
                <td className="table-cell">{ad.platform}</td>
                <td className="table-cell">{ad.browser}</td>
                <td className="table-cell text-right font-mono">${ad.spent.toFixed(2)}</td>
                <td className="table-cell text-right font-mono">{ad.impressions.toLocaleString()}</td>
                <td className="table-cell text-right font-mono">{ad.clicks.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        pageSize={pagination.pageSize}
        totalElements={pagination.totalElements}
        onPageSizeChange={onPageSizeChange}
      />
    </Card>
  )
}
