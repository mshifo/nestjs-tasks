import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteredDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) { }

  getAllTasks(getTasksFilteredDto: GetTasksFilteredDto): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilteredDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} Not Found`);
    }
    return task;
  }

  addTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} Not Found`);
    }

    return result.affected === 1;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<boolean> {
    const result = await this.taskRepository.update(id, { status });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} Not Found`);
    }

    return result.affected === 1;
  }
}
