export const API_URL: string = (import.meta as any).env.VITE_API_URL || 'http://localhost:8081'

export const AVAILABLE_DIMENSIONS = ['day', 'week', 'month', 'campaign', 'country', 'platform', 'browser'] as const

export const AVAILABLE_METRICS = ['spent', 'impressions', 'clicks'] as const

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const

export const DEFAULT_PAGE_SIZE = 10

export const DEFAULT_FILTER_VALUES = {
  selectedCountry: 'All',
  selectedCampaign: 'All',
  selectedPlatform: 'All',
  selectedBrowser: 'All',
  startDate: '',
  endDate: ''
} as const
