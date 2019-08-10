export interface ObjectOf<T> {
  [key: string]: T
}

export interface Logger {
  log: (message: string, payload?: any) => void
}
