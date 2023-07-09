import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilteredDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }

  async getTasks(
    getTasksFilteredDto: GetTasksFilteredDto,
    user: User,
  ): Promise<Task[]> {
    const { search, status } = getTasksFilteredDto;
    const query = this.createQueryBuilder();
    const { id } = user;

    query.where('"userId" = :id', { id });

    if (status) {
      query.andWhere('status = :status', { status });
    }
    if (search) {
      query.andWhere('(title like :search or description like :search)', {
        search: `%${search}%`,
      });
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `failed getting tasks for user ${
          user.username
        }, filters: ${JSON.stringify(getTasksFilteredDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
