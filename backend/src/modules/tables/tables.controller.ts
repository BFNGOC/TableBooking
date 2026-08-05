import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from '@app/decorator/roles.decorator';
import { FindTablesDto } from './dto/find-table.dto';
import { TableParamDto } from './dto/table-param.dto';
import { UpdateTablePositionDto } from './dto/update-table-position.dto';
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles(UserRole.RESTAURANT)
  create(
    @Body() createTableDto: CreateTableDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tablesService.create(createTableDto, user);
  }

  @Get()
  findAll(@Query() findTablesDto: FindTablesDto) {
    return this.tablesService.findAll(findTablesDto);
  }

  @Get(':tableId')
  findOne(@Param() params: TableParamDto) {
    return this.tablesService.findOne(params.tableId);
  }

  @Patch(':tableId')
  @Roles(UserRole.RESTAURANT)
  update(
    @Param() params: TableParamDto,
    @Body() updateTableDto: UpdateTableDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tablesService.update(params.tableId, updateTableDto, user);
  }

  @Patch(':tableId/position')
  @Roles(UserRole.RESTAURANT)
  updatePosition(
    @Param() params: TableParamDto,
    @Body() updateTablePositionDto: UpdateTablePositionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tablesService.updatePosition(
      params.tableId,
      updateTablePositionDto,
      user,
    );
  }

  @Delete(':tableId')
  @Roles(UserRole.RESTAURANT)
  remove(@Param() params: TableParamDto, @CurrentUser() user: AuthUser) {
    return this.tablesService.remove(params.tableId, user);
  }
}
