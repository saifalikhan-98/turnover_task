import { Request, Response } from 'express';
import { decodeAndVerifyJwtToken } from './utils/decodToken';

export async function createContext({
    req,
    res,
  }: {
    req: Request;
    res: Response;
  }): Promise<{ ctx: { user: number | null } }> {
    async function getUserFromHeader() {
      const headers: { authorization?: string } = req.headers;
  
      if (headers.authorization) {
        const token = String(headers.authorization);
        const user = await decodeAndVerifyJwtToken(token);
        return user;
      }
      return null;
    }
    console.log(req.params)
    console.log(req.body)
    const user = await getUserFromHeader();
  
    return {
      ctx: {user}
    };
  }

export type Context = Awaited<ReturnType<typeof createContext>>;
