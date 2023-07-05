import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { username, email, password } = signUpDto;
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
