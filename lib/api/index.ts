import { Logger } from '../types'

import { ApiError } from './apiError'

let apiInstance: Api | undefined

export class Api {
  constructor(private logger: Logger) {
    if (apiInstance) {
      throw new ApiError(
        `API already exists! Use 'getApi' to obtain the API instance`,
      )
    }
    apiInstance = this
  }
}

export const getAPI = () => {
  if (!apiInstance) {
    throw new ApiError('No API instance created!')
  }
  return apiInstance
}

export const clearAPIInstance = () => {
  apiInstance = undefined
}
