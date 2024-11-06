
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";


export class CreateParentRequest {

  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  image: string;
  bloodGroup: string;
  @IsNotEmpty()
  phoneNumber: string;
  address: string;
}