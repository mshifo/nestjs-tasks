import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(signUpDto: SignUpDto): Promise<void> {
    return this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const { username, email } = await this.userRepository.signIn(signInDto);

    const payload = { username, email };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
