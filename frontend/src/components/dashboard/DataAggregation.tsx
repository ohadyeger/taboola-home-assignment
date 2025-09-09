import React from 'react'
import { AggregationState, FilterState, AggregatedMetrics, SortState } from '../../types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { AVAILABLE_DIMENSIONS, AVAILABLE_METRICS } from '../../utils/constants'

interface DataAggregationProps {
  aggregationState: AggregationState
  filters: FilterState
  aggregatedData: AggregatedMetrics[]
  sortState: SortState
  loading: boolean
  onDimensionToggle: (dimension: string) => void
  onMetricToggle: (metric: string) => void
  onGenerateAggregation: () => void
  onExportCsv: () => void
  onExportJson: () => void
  onSort: (field: string) => void
}

export const DataAggregation: React.FC<DataAggregationProps> = ({
  aggregationState,
  filters,
  aggregatedData,
  sortState,
  loading,
  onDimensionToggle,
  onMetricToggle,
  onGenerateAggregation,
  onExportCsv,
  onExportJson,
  onSort
}) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortState.sortBy !== field) return null
    return (
      <svg 
        className={`w-4 h-4 ${sortState.sortDirection === 'asc' ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900">Data Aggregation</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Group By Dimensions</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {AVAILABLE_DIMENSIONS.map(dim => (
              <label key={dim} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={aggregationState.clickedDimensions.includes(dim)}
                  onChange={() => onDimensionToggle(dim)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700 capitalize">{dim}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Metrics to Aggregate</label>
          <div className="flex gap-4">
            {AVAILABLE_METRICS.map(metric => (
              <label key={metric} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={aggregationState.clickedMetrics.includes(metric)}
                  onChange={() => onMetricToggle(metric)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700 capitalize">{metric}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={onGenerateAggregation}
            disabled={loading || aggregationState.clickedMetrics.length === 0}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          >
            Generate Aggregation
          </Button>
          
          {aggregatedData.length > 0 && (
            <>
              <Button 
                onClick={onExportCsv}
                disabled={loading || aggregationState.clickedMetrics.length === 0}
                variant="success"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                Export CSV
              </Button>
              
              <Button 
                onClick={onExportJson}
                disabled={loading || aggregationState.clickedMetrics.length === 0}
                variant="info"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                }
              >
                Export JSON
              </Button>
            </>
          )}
        </div>
      </div>
      
      {aggregatedData.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-900">Aggregated Results</h4>
          </div>
          
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  {aggregationState.groupByDimensions.map(dim => (
                    <th key={dim} className="table-cell text-left font-semibold capitalize">
                      {dim}
                    </th>
                  ))}
                  {aggregationState.selectedMetrics.includes('spent') && (
                    <th 
                      className="table-cell text-right font-semibold cursor-pointer hover:bg-gray-100 transition-colors" 
                      onClick={() => onSort('spent')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Total Spent
                        <SortIcon field="spent" />
                      </div>
                    </th>
                  )}
                  {aggregationState.selectedMetrics.includes('impressions') && (
                    <th 
                      className="table-cell text-right font-semibold cursor-pointer hover:bg-gray-100 transition-colors" 
                      onClick={() => onSort('impressions')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Total Impressions
                        <SortIcon field="impressions" />
                      </div>
                    </th>
                  )}
                  {aggregationState.selectedMetrics.includes('clicks') && (
                    <th 
                      className="table-cell text-right font-semibold cursor-pointer hover:bg-gray-100 transition-colors" 
                      onClick={() => onSort('clicks')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Total Clicks
                        <SortIcon field="clicks" />
                      </div>
                    </th>
                  )}
                  <th className="table-cell text-right font-semibold">Records</th>
                </tr>
              </thead>
              <tbody>
                {aggregatedData.map((row, i) => (
                  <tr key={i} className="table-row">
                    {aggregationState.groupByDimensions.map(dim => (
                      <td key={dim} className="table-cell">
                        {row.dimensions[dim] || '-'}
                      </td>
                    ))}
                    {aggregationState.selectedMetrics.includes('spent') && (
                      <td className="table-cell text-right font-mono">
                        ${row.totalSpent.toFixed(2)}
                      </td>
                    )}
                    {aggregationState.selectedMetrics.includes('impressions') && (
                      <td className="table-cell text-right font-mono">
                        {row.totalImpressions.toLocaleString()}
                      </td>
                    )}
                    {aggregationState.selectedMetrics.includes('clicks') && (
                      <td className="table-cell text-right font-mono">
                        {row.totalClicks.toLocaleString()}
                      </td>
                    )}
                    <td className="table-cell text-right font-mono">
                      {row.recordCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  )
}
