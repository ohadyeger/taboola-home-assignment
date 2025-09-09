import React from 'react'
import { FilterState } from '../../types'
import { Card } from '../ui/Card'

interface FiltersProps {
  filters: FilterState
  availableCountries: string[]
  availableCampaigns: string[]
  availablePlatforms: string[]
  availableBrowsers: string[]
  onFilterChange: (filters: Partial<FilterState>) => void
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  availableCountries,
  availableCampaigns,
  availablePlatforms,
  availableBrowsers,
  onFilterChange
}) => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select 
            value={filters.selectedCountry} 
            onChange={(e) => onFilterChange({ selectedCountry: e.target.value })}
            className="select-field w-full"
          >
            <option value="All">All Countries</option>
            {availableCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
          <select 
            value={filters.selectedCampaign} 
            onChange={(e) => onFilterChange({ selectedCampaign: e.target.value })}
            className="select-field w-full"
          >
            <option value="All">All Campaigns</option>
            {availableCampaigns.map(campaign => (
              <option key={campaign} value={campaign}>{campaign}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
          <select 
            value={filters.selectedPlatform} 
            onChange={(e) => onFilterChange({ selectedPlatform: e.target.value })}
            className="select-field w-full"
          >
            <option value="All">All Platforms</option>
            {availablePlatforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Browser</label>
          <select 
            value={filters.selectedBrowser} 
            onChange={(e) => onFilterChange({ selectedBrowser: e.target.value })}
            className="select-field w-full"
          >
            <option value="All">All Browsers</option>
            {availableBrowsers.map(browser => (
              <option key={browser} value={browser}>{browser}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ startDate: e.target.value })}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ endDate: e.target.value })}
                className="input-field text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Leave empty for last week</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
