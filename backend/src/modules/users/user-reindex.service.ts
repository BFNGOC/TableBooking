import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './schemas/user.schema';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserSearchService } from './user-search.service';

@Injectable()
export class UserReindexService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly userSearchService: UserSearchService,
  ) {}

  async reindex() {
    const users = await this.userModel.find();

    for (const user of users) {
      await this.userSearchService.index(user);
    }

    return {
      total: users.length,
    };
  }
}
