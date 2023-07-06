import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilteredDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
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

    return await query.getMany();
  }
}
