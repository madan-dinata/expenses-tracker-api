export class AppError extends Error {
  status: number

  constructor(message: string, status: number, name: string) {
    super(message)
    this.status = status
    this.name = name || 'AppError'
    Error.captureStackTrace(this, this.constructor) // Agar stack trace tetap jelas
  }
}
