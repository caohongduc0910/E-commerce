export class ResponseData {
  data: any
  message: String
  statusCode: number

  constructor(data: any, statusCode: number, message: String) {
    (this.data = data),
      (this.statusCode = statusCode),
      (this.message = message)
  }
}
