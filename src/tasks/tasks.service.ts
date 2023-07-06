import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteredDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getAllTasks(
    getTasksFilteredDto: GetTasksFilteredDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilteredDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id, userId: user.id });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} Not Found`);
    }
    return task;
  }

  addTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<boolean> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} Not Found`);
    }

    return result.affected === 1;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<boolean> {
    const result = await this.taskRepository.update(
      { id, userId: user.id },
      { status },
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} Not Found`);
    }

    return result.affected === 1;
  }
}
