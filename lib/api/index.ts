import { Logger } from '../types'

import { ApiError } from './apiError'

abstract class AbstractApi {
  constructor(protected logger: Logger) {}
}

let apiInstance: AbstractApi | undefined

export class Api extends AbstractApi {
  constructor(protected logger: Logger) {
    super(logger)

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

export class TestApi extends AbstractApi {}
