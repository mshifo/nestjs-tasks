import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  host: 'localhost',
  type: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'task_management_nestjs',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
};
