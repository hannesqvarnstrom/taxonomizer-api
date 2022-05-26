import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response): Promise<Response> => {
  return res.send({message: 'app works?'})
};
