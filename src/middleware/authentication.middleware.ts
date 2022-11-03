import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken'
import {SecretService} from "../modules/secret/secret.service";
import {RestrictionService} from "../modules/restrictions/restriction.service";

@Injectable()
export class CheckAccess {
    constructor(private secretService: SecretService,
                private restrictionService: RestrictionService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization').split(' ')[1]
            const check = await jwt.verify(token, this.secretService.getData('jwt').bearer)
            if (!check) {
                return res.status(401).json({
                    message: "Not authenticated"
                })
            }
            const restricted = await this.restrictionService.check(check.id)
            switch (restricted.type) {
                case('BLOCK'):
                    if ((Date.now() - Number(restricted.setAt)) > Number(restricted.timeout)) {
                        await this.restrictionService.declare(check.id,null)
                        return next()
                    }
                    return res.status(401).json({
                        message: `Blocked`
                    })
                case('PERMA'):
                    return res.status(401).json({
                        message: `Perma banished`
                    })
                default:
                    req.body.author = check.id
                    // req.body.role = check.role
                    return next()

            }
        } catch (err) {
            console.log(err)
            res.status(401).json({
                message: "Not authenticated"
            })
        }
    }
}

@Injectable()
export class CheckAdmin {
    constructor(private secretService: SecretService,
                private restrictionService: RestrictionService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.header('Authorization').split(' ')[1]
        const check = await jwt.verify(token, this.secretService.getData('jwt').bearer)
        if (check.role !== 'ADMIN') {
            return res.status(401).json({
                message: "Not admin"
            })
        }
        next()
    }
}