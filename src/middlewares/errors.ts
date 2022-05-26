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
