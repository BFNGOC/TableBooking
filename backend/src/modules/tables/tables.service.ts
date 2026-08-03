import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { AuthUser } from '@app/auth/types/auth-jwt-user.type';

@Injectable()
export class TablesService {
  create(createTableDto: CreateTableDto, user: AuthUser) {
    return 'This action adds a new table';
  }

  findAll() {
    return `This action returns all tables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
