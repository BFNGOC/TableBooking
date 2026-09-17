import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from './schemas/counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name)
    private readonly counterModel: Model<Counter>,
  ) {}

  async next(name: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      {
        _id: name,
      },
      {
        $inc: {
          seq: 1,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return counter.seq;
  }

  async nextCode(prefix: string, name: string): Promise<string> {
    const seq = await this.next(name);

    return `${prefix}${seq.toString().padStart(6, '0')}`;
  }
}
