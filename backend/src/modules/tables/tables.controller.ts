import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from '@app/decorator/roles.decorator';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles(UserRole.RESTAURANT)
  create(
    @Body() createTableDto: CreateTableDto,
    @CurrentUser() user: AuthUser,
  ): string {
    return this.tablesService.create(createTableDto, user);
  }

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(+id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(+id);
  }
}
