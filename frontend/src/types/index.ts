export type AggregatedMetrics = {
  dimensions: Record<string, any>;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  recordCount: number;
}

export type AdMetrics = { 
  day: string; 
  week: string; 
  month: string; 
  accountId: string; 
  campaign: string; 
  country: string; 
  platform: string; 
  browser: string; 
  spent: number; 
  impressions: number; 
  clicks: number 
}

export type PaginatedResponse<T> = {
  data: T[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

export type AuthMode = 'login' | 'register'

export type SortDirection = 'asc' | 'desc'

export type FilterState = {
  selectedCountry: string
  selectedCampaign: string
  selectedPlatform: string
  selectedBrowser: string
  startDate: string
  endDate: string
}

export type AggregationState = {
  clickedDimensions: string[]
  clickedMetrics: string[]
  selectedMetrics: string[]
  groupByDimensions: string[]
}

export type PaginationState = {
  currentPage: number
  pageSize: number
  totalPages: number
  totalElements: number
}

export type SortState = {
  sortBy: string
  sortDirection: SortDirection
}
