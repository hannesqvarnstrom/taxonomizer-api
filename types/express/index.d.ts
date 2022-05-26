import { User } from '../../src/models'
declare global {
  namespace Express {
    interface Request {
      user_id?: string | number
    }
  }

  namespace jwt {
    interface JwtPayload {
      id: number | string,
      email: string
    }
  }
}
