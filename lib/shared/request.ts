const DEFAULT_REQUEST_TIMEOUT = 5000

export interface RequestOptions {
  timeout?: number
  fetchOptions?: RequestInit
}

export const request = <Response>(url: string, reqOptions: RequestOptions = {}): Promise<Response> => {
  const { timeout = DEFAULT_REQUEST_TIMEOUT, fetchOptions } = reqOptions

  return Promise.race([
    fetch(url, fetchOptions).then(async (response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json()
      } else {
        throw new Error(await response.text())
      }
    }),
    new Promise((_, rej) => {
      setTimeout(() => {
        rej(new Error(`Request time limit exceeded!`))
      }, timeout)
    }),
  ]) as any
}
