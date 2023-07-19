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

    try {

      const auth = req.headers.auth;

      if (!auth || typeof auth !== 'string') return next()

      const [bearer, token] = auth.split(" ")

      if (bearer != "ut") return next()

      req.requester = this.jwtService.verify(token)

    } catch (error) {

      req.requester = null;
    }
    next();
  }

}


// interface GeoPoint {
//   lat: number;
//   lon: number;
// }

// interface GeoPoint {
//   address?: string;
// }

// function printCoords(pt: GeoPoint): void {
//   console.log(pt.lat)
//   console.log(pt.lon)
// }

// printCoords({ lat: 32, lon: 41 });
// printCoords({ lat: 32, lon: 41, address: "robat karim" });

// const x: GeoPoint = {
//   lon: 41,
//   lat: 44,
//   address: "robat charim"
// }

type PositiveOddNumberLowerThanTen = 1 | 3 | 5 | 7 | 9;

function generateNumber(): number {
  return 5
}

const x = generateNumber()
const y = generateNumber() as PositiveOddNumberLowerThanTen
const z = (generateNumber() as any) as string
