import { Request, Response } from "express";
import { User } from "../../src/models";

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response): Promise<Response> => {
  return res.send({ message: 'app works?' })
};
