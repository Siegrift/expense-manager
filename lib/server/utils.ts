import { ServerResponse } from 'http'

export const redirect = (res: ServerResponse, path: string) => {
  res.writeHead(301, { Location: path })
  res.end()
}
