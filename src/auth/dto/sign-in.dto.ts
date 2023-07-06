import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SignInDto {
  @ValidateIf((dto) => dto.email == undefined)
  @IsString()
  username: string;

  @ValidateIf((dto) => dto.username == undefined)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
