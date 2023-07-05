import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteredDto } from './dto/get-tasks-filter.dto';
import { ValidateStatusPipe } from './pipes/validate-status.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get('/')
  all(
    @Query(ValidationPipe) getTasksFilteredDto: GetTasksFilteredDto,
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(getTasksFilteredDto);
  }

  @Get('/:id')
  find(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  add(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.addTask(createTaskDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.tasksService.deleteTask(id);
  }

  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ValidateStatusPipe) status: TaskStatus,
  ): Promise<boolean> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
