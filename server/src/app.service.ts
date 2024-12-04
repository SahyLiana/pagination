import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import { Model } from 'mongoose';
import { QueryDto } from './query.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getTasksService(query: QueryDto) {
    console.log(query);
    console.log('limit is', query.limit, typeof query.limit);
    console.log('skip is', query.skip, typeof query.skip);
    console.log('name is', query.name, typeof query.name);

    // const tasks = await this.taskModel
    //   .find()
    //   .limit(query.limit)
    //   .skip(query.skip);

    //TO FIND THE NUMBER OF DOCUMENT AND WE RETURN BOTH DATA AND DOCUMENT

    // const countTask = await this.taskModel.estimatedDocumentCount();

    //OR

    const countData = await this.taskModel.aggregate([
      {
        $match: {
          name: { $regex: query.name ? query.name : '', $options: 'i' },
        },
      }, //OPTIONAL, WE USE IT IF THERE ARE SOME CONDITIONS
      {
        $facet: {
          data: [{ $skip: query.skip }, { $limit: query.limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    console.log(countData);

    return countData;
  }

  async createTaskService(body: { name: string }) {
    console.log(body);
    const myTask = this.taskModel.create({ ...body });

    try {
      const newTask = (await myTask).save();
      return newTask;
    } catch (e) {
      console.log(e);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
