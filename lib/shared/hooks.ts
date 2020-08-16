import { useState, useEffect } from 'react'

import { useMediaQuery, useTheme } from '@material-ui/core'

import { ExchangeRates } from '../settings/state'

import { request } from './request'

export const useIsBigDevice = () => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up('sm'))
}

// inspired by: https://scotch.io/tutorials/create-a-custom-usefetch-react-hook
export const useFetch = (url: string) => {
  const [response, setResponse] = useState<ExchangeRates | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await request<ExchangeRates>(url)
        setResponse(json)
      } catch (error) {
        setError(error)
      }
    }
    fetchData()
  }, [])
  return { loading: response === null, error, data: response }
}
