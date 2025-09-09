import { useState, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'

export const useFilters = () => {
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableCampaigns, setAvailableCampaigns] = useState<string[]>([])
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([])
  const [availableBrowsers, setAvailableBrowsers] = useState<string[]>([])
  const [error, setError] = useState<string | undefined>()

  const fetchAvailableCountries = useCallback(async (token: string) => {
    try {
      const data = await apiClient.requestWithAuth<string[]>('/api/ads/countries', token)
      setAvailableCountries(data)
    } catch (e) {
      setError(String(e))
    }
  }, [])

  const fetchAvailableCampaigns = useCallback(async (token: string) => {
    try {
      const data = await apiClient.requestWithAuth<string[]>('/api/ads/campaigns', token)
      setAvailableCampaigns(data)
    } catch (e) {
      setError(String(e))
    }
  }, [])

  const fetchAvailablePlatforms = useCallback(async (token: string) => {
    try {
      const data = await apiClient.requestWithAuth<string[]>('/api/ads/platforms', token)
      setAvailablePlatforms(data)
    } catch (e) {
      setError(String(e))
    }
  }, [])

  const fetchAvailableBrowsers = useCallback(async (token: string) => {
    try {
      const data = await apiClient.requestWithAuth<string[]>('/api/ads/browsers', token)
      setAvailableBrowsers(data)
    } catch (e) {
      setError(String(e))
    }
  }, [])

  const fetchAllFilters = useCallback(async (token: string) => {
    await Promise.all([
      fetchAvailableCountries(token),
      fetchAvailableCampaigns(token),
      fetchAvailablePlatforms(token),
      fetchAvailableBrowsers(token)
    ])
  }, [fetchAvailableCountries, fetchAvailableCampaigns, fetchAvailablePlatforms, fetchAvailableBrowsers])

  return {
    availableCountries,
    availableCampaigns,
    availablePlatforms,
    availableBrowsers,
    error,
    fetchAvailableCountries,
    fetchAvailableCampaigns,
    fetchAvailablePlatforms,
    fetchAvailableBrowsers,
    fetchAllFilters,
    setError
  }
}
