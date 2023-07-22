import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "src/schema/user.schema";

interface requester {
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      requester?: requester;
      me?: UserDocument;
    }
  }
}

@Injectable()
export class jwtAuthMiddleware implements NestMiddleware {

  constructor(private readonly jwtService: JwtService) { }
  
  use(req: Request, res: Response, next: NextFunction) {
    console.log("start of middleware")

    try {

      const auth = req.headers.auth;

      if (!auth || typeof auth !== 'string') return next()

      const [bearer, token] = auth.split(" ")
      console.log(token)

      if (bearer != "ut") return next()

      req.requester = this.jwtService.verify(token)
      // console.log("/////////",req.requester)

    } catch (error) {

      req.requester = null;
    }
    console.log("////",req.requester)
    next();
  }

}

