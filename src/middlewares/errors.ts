export class TError extends Error {
  status?: number

  constructor (message?: string, status?: number) {
    super(message)
    this.status = status
  }
}

export class PasswordMismatch extends TError {
    status = 400
    message = 'Passwords do not match'
}

export class EmailTaken extends TError {
    status = 400
    message = 'Email already exists'
}

export class NoRecordsOfUser extends TError {
    status = 400
    message = 'No matching email or password'
}

export class BadRequest extends TError {
    status = 400
    message = 'Bad Request'
}

export class SessionExpired extends TError {
  status = 401
  message = 'Login session expired'
}

export class NotFound extends TError {
  status = 404
  message = 'Not found'
}

export class Unauthorized extends TError {
  status = 401
  message = 'Unauthorized'
}