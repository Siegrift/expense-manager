export interface ObjectOf<T> {
  [key: string]: T
}

export interface Logger {
  log: (message: string, payload?: any) => void
}

export type FirebaseField = { uid: string; id: string }

export interface DateRange {
  start: Date
  end: Date
}
