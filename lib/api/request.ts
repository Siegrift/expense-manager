import { Logger, ObjectOf } from '../types'
import { DEFAULT_REQUEST_TIMEOUT } from '../constants'
import { ApiError } from './apiError'

export interface RequestOptions {
  body?: any
  headers?: ObjectOf<string>
  timeout?: number
}

export const requestFactory = (logger?: Logger) => (
  url: string,
  method: 'POST' | 'GET',
  reqOptions: RequestOptions = {},
) => {
  const { headers, timeout = DEFAULT_REQUEST_TIMEOUT, body } = reqOptions

  const options = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...headers,
    }),
    body,
  }
  return Promise.race([
    fetch(url, options).then(async (response) => {
      if (logger) {
        logger.log(`Fetch - ${method} ${url}`, {
          request: { url, options },
          response,
        })
      }

      if (response.status >= 200 && response.status < 300) {
        return response.json()
      } else {
        throw new ApiError(await response.text(), response)
      }
    }),
    new Promise((_, rej) => {
      setTimeout(() => {
        rej(new ApiError(`Request time limit exceeded!`))
      }, timeout)
    }),
  ])
}

export const request = requestFactory()
