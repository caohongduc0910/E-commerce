export class ResponseData {
  data: any
  statusCode: number
  message: String

  constructor(data: any, statusCode: number, message: String) {
    (this.data = data),
      (this.statusCode = statusCode),
      (this.message = message)
  }
}
