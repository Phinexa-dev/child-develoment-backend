import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { compare, hash } from 'bcryptjs';
import { ParentService } from 'src/parent/parent.service';
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt';
import { Parent } from '@prisma/client';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { PasswordResetRequest } from './dto/password-reset-request';


@Injectable()
export class AuthService {
    constructor(private readonly parentService: ParentService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly databaseService: DatabaseService,
        private readonly mailerService: MailerService,
    ) { }

    async login(parent: Parent, response: Response) {
        const expireAccessToken = new Date()
        expireAccessToken.setMilliseconds(expireAccessToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION')))

        const expireRefreshToken = new Date()
        expireRefreshToken.setMilliseconds(expireAccessToken.getTime() + parseInt(this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION')))


        const tokenPayload: TokenPayload = { parentId: parent.parentId.toString() }

        const accessToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION')}ms`
        })

        const refreshToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION')}ms`
        })

        await this.parentService.update(parent.parentId, { refreshToken: await hash(refreshToken, 10) })

        response.cookie('Authentication', accessToken, { httpOnly: true, secure: false, expires: expireAccessToken, }) //cahnge to true in production
        response.cookie('Refresh', refreshToken, { httpOnly: true, secure: false, expires: expireRefreshToken, }) //cahnge to true in production

        const children = await this.databaseService.parentChild.findMany({
            where: {
                parentId: parent.parentId,
                status: 'Active',
            },
            include: {
                child: {
                    select: {
                        childId: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        const childDetails = children.map(child => ({
            childId: child.child.childId,
            firstName: child.child.firstName,
            lastName: child.child.lastName,
        }));
        response.json(childDetails)
    }

    async verifyUser(email: string, password: string) {
        try {
            const user = await this.parentService.findParent(email)
            const authenticated = await compare(password, user.password)
            if (!authenticated) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized - Invalid email or Password')
        }
    }

    async verifyUserRefreshToken(refreshToken: string, userId: string) {
        try {
            const user = await this.parentService.findOne(parseInt(userId))
            const authenticated = await compare(refreshToken, user.refreshToken)
            if (!authenticated) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (error) {
            throw new UnauthorizedException('Refresh Token is not valid')

        }
    }

    async forgetPassword(forgetPasswordRequest: { email: string }) {
        const { email } = forgetPasswordRequest;
    
        // Check if user exists
        const user = await this.databaseService.parent.findFirst({
            where: { email },
        });
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        // Generate a 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
    
        await this.mailerService.sendMail({
            to: email,
            subject: 'Password Reset PIN',
            text: `Hello,\n\nYour password reset PIN is: ${pin}\nThis PIN will expire in 10 minutes.`,
            html: `<h1>Password Reset</h1><p>Your password reset PIN is: <strong>${pin}</strong></p><p>This PIN will expire in 10 minutes.</p>`,
        });
    
        // Return the PIN (for frontend validation)
        return { pin, message: 'Reset PIN sent to your email' };
    }

    async passwordReset(passwordResetRequest: PasswordResetRequest) {
        
    }
}
