import { Controller, Post, UseGuards, Request, Res, Body, Delete, Param } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { CurrentUser } from './current-user.decorator';
import { Prisma, Parent } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresg-auth.guard';
import { ParentService } from 'src/parent/parent.service';
import { CreateParentRequest } from 'src/parent/dto/create-parent.request';
import { ApiTags } from '@nestjs/swagger';
import { ForgetPasswordRequest } from './dto/forgetpassword-request';
import { PasswordResetRequest } from './dto/password-reset-request';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        private readonly parentService: ParentService
    ){}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@CurrentUser() parent: Parent,
        @Res({ passthrough: true }) response: Response) {
        await this.authService.login(parent, response)
    }

    @Post('refresh')
    // @UseGuards(JwtRefreshAuthGuard)
    async refresh(@CurrentUser() parent: Parent,
        @Res({ passthrough: true }) response: Response) {
        await this.authService.login(parent, response)
    }

    @Post('signup')
    async signup( @Body() createParentDto: CreateParentRequest) {
      return await this.parentService.create(createParentDto);
    }

    @Post('forgetpassword')
    // @UseGuards(LocalAuthGuard)
    async forgetpassword( @Body() forgetPasswordRequest: ForgetPasswordRequest) {
      return await this.authService.emailVerification(forgetPasswordRequest, "Password Reset");
    }

    @Post('verifyemail')
    // @UseGuards(LocalAuthGuard)
    async emailverification( @Body() forgetPasswordRequest: ForgetPasswordRequest) {
      return await this.authService.emailVerification(forgetPasswordRequest, "Email Verification");
    }

    @Post('passwordreset')
    // @UseGuards(LocalAuthGuard)
    async passwordreset( @Body() passwordResetRequest: PasswordResetRequest) {
      return await this.parentService.forgetPasswordReset(passwordResetRequest);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteAccount(@Param('id') id: number) {
      return await this.parentService.remove(id);
    }

}
