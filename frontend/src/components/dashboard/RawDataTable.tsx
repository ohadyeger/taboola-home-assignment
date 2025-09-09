import React from 'react'
import { AdMetrics } from '../../types'
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
    <div>
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
    </div>
  )
}
