import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  totalElements: number
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalElements,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50]
}) => {
  const paginationBtnClasses = "px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
  const disabledClasses = "opacity-50 cursor-not-allowed"

  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Page size:</label>
          <select 
            value={pageSize} 
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value))
              onPageChange(0) // Reset to first page when changing page size
            }}
            className="select-field text-sm"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-600">
          Total: <span className="font-semibold">{totalElements}</span> records
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className={`${paginationBtnClasses} ${currentPage === 0 ? disabledClasses : ''}`}
        >
          First
        </button>
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`${paginationBtnClasses} ${currentPage === 0 ? disabledClasses : ''}`}
        >
          Previous
        </button>
        
        <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded">
          Page {currentPage + 1} of {totalPages}
        </span>
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={`${paginationBtnClasses} ${currentPage >= totalPages - 1 ? disabledClasses : ''}`}
        >
          Next
        </button>
        <button 
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className={`${paginationBtnClasses} ${currentPage >= totalPages - 1 ? disabledClasses : ''}`}
        >
          Last
        </button>
      </div>
    </div>
  )
}
