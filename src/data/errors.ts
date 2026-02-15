/**
 * Shared error classes for consistent error handling across the application.
 * Each error includes an HTTP status code for proper API responses.
 */

export class NotFoundError extends Error {
  statusCode = 404
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  statusCode = 409
  constructor(message: string = 'Resource conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class BadRequestError extends Error {
  statusCode = 400
  constructor(message: string = 'Bad request') {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class ValidationError extends Error {
  statusCode = 422
  constructor(message: string = 'Validation failed') {
    super(message)
    this.name = 'ValidationError'
  }
}
