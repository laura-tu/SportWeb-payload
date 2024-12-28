import { APIError } from 'payload/errors'

export class BadRequestError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(message, 401, undefined, true)
  }
}

export class ForbiddenError extends APIError {
  constructor(message = 'Forbidden') {
    super(message, 403, undefined, true)
  }
}

export class NotFoundError extends APIError {
  constructor(message = 'Not Found', isPublic = true) {
    super(message, 404, undefined, isPublic)
  }
}

export class ConflictError extends APIError {
  constructor(message = 'Conflict', isPublic = true) {
    super(message, 409, undefined, isPublic)
  }
}
