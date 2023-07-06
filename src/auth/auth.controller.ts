import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-in')
  signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<{ token: string }> {
    return this.authService.signIn(signInDto);
  }
}
