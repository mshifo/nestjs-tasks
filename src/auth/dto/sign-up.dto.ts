import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsStrongPassword(
    { minUppercase: 1, minSymbols: 1, minLength: 8, minNumbers: 0 },
    {
      message:
        'Password Must contain at least 1 uppercase letter and 1 symbol with 8 length characters',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
