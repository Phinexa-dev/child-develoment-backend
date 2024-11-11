import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { CurrentUser } from './current-user.decorator';
import { Prisma, Parent } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresg-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@CurrentUser() parent: Parent,
        @Res({ passthrough: true }) response: Response) {
        await this.authService.login(parent, response)
    }

    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refresh(@CurrentUser() parent: Parent,
        @Res({ passthrough: true }) response: Response) {
        await this.authService.login(parent, response)
    }
}
