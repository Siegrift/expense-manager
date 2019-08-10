export class ApiError {
  reason: string
  response?: Response

  constructor(reason: string, response?: Response) {
    this.reason = reason
    this.response = response
  }
}
