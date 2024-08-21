
import { IsEmail, IsStrongPassword } from "class-validator";


export class CreateParentRequest{
    
  firstName :  String;
  lastName  :  String;

  @IsEmail()
  email     :  String ;
  
  @IsStrongPassword()
  password   : String;
  
  image      : String;
  bloodGroup  :String;
  phoneNumber :String ; 
  address    : String;
}