import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export async function authToken(
  request: Request,
  response: Response,
  nextFunction: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).end();
  }

  const [, token] = authToken.split(" ");
  
  try {
    const { uuid } = verify(token, process.env.TOKEN_HASH || "") as {
      uuid: string;
    };
    return nextFunction();
  } catch (error) {
    return response.status(401).json(error);
  }
}
