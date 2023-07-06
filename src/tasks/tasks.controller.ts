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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteredDto } from './dto/get-tasks-filter.dto';
import { ValidateStatusPipe } from './pipes/validate-status.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  @Get('/')
  all(
    @GetUser() user: User,
    @Query(ValidationPipe) getTasksFilteredDto: GetTasksFilteredDto,
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(getTasksFilteredDto, user);
  }

  @Get('/:id')
  find(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  add(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.addTask(createTaskDto, user);
  }

  @Delete('/:id')
  delete(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.tasksService.deleteTask(id, user);
  }

  @Put('/:id')
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ValidateStatusPipe) status: TaskStatus,
  ): Promise<boolean> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
