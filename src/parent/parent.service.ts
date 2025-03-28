import { BadRequestException, ConsoleLogger, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcryptjs'
import { DatabaseService } from 'src/database/database.service';
import { CreateParentRequest } from './dto/create-parent.request';
import { unlinkSync } from 'fs';
import { UpdateParentDto } from './dto/update-parent-dto';
import { ConfigService } from '@nestjs/config';
import { PasswordResetRequest } from 'src/auth/dto/password-reset-request';


@Injectable()
export class ParentService {
  constructor(private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService) { }

  async create(createParentDto: CreateParentRequest) {

    const existingEmail = await this.databaseService.parent.findFirst({
      where: { email: createParentDto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email is already in use');
    }

    const existingNumber = await this.databaseService.parent.findFirst({
      where: { phoneNumber: createParentDto.phoneNumber },
    });
    if (existingNumber) {
      throw new BadRequestException('Phone number is already in use');
    }
    const createParentData: Prisma.ParentCreateInput = {
      firstName: createParentDto.firstName,
      lastName: createParentDto.lastName,
      email: createParentDto.email,
      password: (await hash(createParentDto.password, 10)),
      phoneNumber: createParentDto.phoneNumber,
      image: createParentDto.image || null,
      bloodGroup: createParentDto.bloodGroup || null,
      address: createParentDto.address || null,
    };

    const user = await this.databaseService.parent.create({
      data: createParentData,
    });

    return {
      userId: user.parentId,
      email: user.email,
    };
  }

  async findAll() {
    return await this.databaseService.parent.findMany({})
  }

  async findOne(parentId: number) {
    return this.databaseService.parent.findUnique({
      where: {
        parentId,
      }
    })
  }

  async update(parentId: number, updateParentDto: Prisma.ParentUpdateInput) {
    return this.databaseService.parent.update({
      where: {
        parentId,
      },
      data: updateParentDto,
    })
  }

  async remove(parentId: number) {
    return this.databaseService.parent.delete({
      where: { parentId }
    })
  }

  async findParent(email: string) {
    const parent = await this.databaseService.parent.findUnique({
      where: {
        email,
      }
    })
    if (!parent) {
      throw new NotFoundException("User not found")
    }
    return parent;
  }

  async findMyAccount(parentId: number) {
    const parent = await this.databaseService.parent.findUnique({
      where: {
        parentId,
      },
      select: {
        parentId: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        bloodGroup: true,
        phoneNumber: true,
        address: true,
      },
    });

    if (!parent) {
      throw new NotFoundException(`Parent with ID ${parentId} not found`);
    }

    const baseUrl = this.configService.get<string>('ENV_UPLOADS'); // Base URL from environment variable

    return {
      ...parent,
      image: parent.image ? `${baseUrl}/parent-images/${parent.image}` : null, // Prepend base URL to image path
    };
  }

  async UpdateMyAccount(
    parentId: number,
    updateParentDto: UpdateParentDto,
    parentTokenId: number,
    file: Express.Multer.File | null,
  ) {
    if (parentId !== parentTokenId) {
      throw new UnauthorizedException('You are not authorized to update this account');
    }

    const existingParent = await this.databaseService.parent.findUnique({
      where: { parentId },
      select: { image: true },
    });

    if (!existingParent) {
      throw new NotFoundException(`Parent with ID ${parentId} not found`);
    }

    if (file) {
      if (existingParent.image) {
        const oldImagePath = `./uploads/parent-images/${existingParent.image}`;
        try {
          unlinkSync(oldImagePath);
        } catch (err) {
          console.warn(`Failed to delete old image: ${oldImagePath}`);
        }
      }

      updateParentDto.image = `${file.filename}`;
    }

    return this.databaseService.parent.update({
      where: { parentId },
      data: updateParentDto,
    });
  }

  async forgetPasswordReset(forgetPasswordRequest: PasswordResetRequest) {
    const { email, password } = forgetPasswordRequest;
  
    // Check if user exists
    const user = await this.databaseService.parent.findFirst({
      where: { email },
    });
  
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  
    // Update the password in the database
    const updatedUser = await this.databaseService.parent.update({
      where: { email },
      data: { password: await hash(password, 10) },
    });
  
    return {
      message: 'Password successfully updated',
      email: updatedUser.email,
    };
  }
}
