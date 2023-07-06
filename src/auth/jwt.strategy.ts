import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'MySecret',
    });
  }

  async validate(payload): Promise<User> {
    const { username, email } = payload;
    const user = await this.userRepository
      .createQueryBuilder()
      .andWhere('username = :username', { username })
      .orWhere('email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('User with given credentials not found!');
    }

    return user;
  }
}
