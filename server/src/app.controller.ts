import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { QueryDto } from './query.dto';

@Controller('api/tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getTasks(@Query() query: QueryDto) {
    return this.appService.getTasksService(query);
  }

  @Post()
  createTask(@Body() body: { name: string }) {
    return this.appService.createTaskService(body);
  }
}
