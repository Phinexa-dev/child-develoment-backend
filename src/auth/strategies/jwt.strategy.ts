import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../token-payload.interface";
import { ParentService } from "src/parent/parent.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService: ConfigService, private readonly parentService:ParentService ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request:Request)=>request.cookies?.Authentication]),
            secretOrKey:configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET')
        })
       
    }
    async validate(payload:TokenPayload){
        const parentIdAsNumber = Number(payload.parentId);  // Convert string to number
    if (isNaN(parentIdAsNumber)) {
        throw new Error('Invalid parentId');  // Handle potential invalid conversion
    }
            return this.parentService.findOne(parentIdAsNumber);
    }
}