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
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import { Roles } from '@app/decorator/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { TableAvailabilitiesService } from './table-availabilities.service';
import { CreateTableAvailabilityDto } from './dto/create-table-availability.dto';
import { FindTableAvailabilityDto } from './dto/find-table-availability.dto';
import { UpdateTableAvailabilityDto } from './dto/update-table-availability.dto';

@Controller('table-availabilities')
export class TableAvailabilitiesController {
  constructor(
    private readonly tableAvailabilitiesService: TableAvailabilitiesService,
  ) {}

  @Post()
  @Roles(UserRole.RESTAURANT)
  create(
    @Body() createTableAvailabilityDto: CreateTableAvailabilityDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tableAvailabilitiesService.create(
      createTableAvailabilityDto,
      user,
    );
  }

  @Get()
  @Roles(UserRole.CUSTOMER)
  findAvailable(
    @Query() query: FindTableAvailabilityDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.tableAvailabilitiesService.findAvailable(query, user!);
  }

  @Get(':id')
  @Roles(UserRole.CUSTOMER)
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.tableAvailabilitiesService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT)
  update(
    @Param('id') id: string,
    @Body() updateTableAvailabilityDto: UpdateTableAvailabilityDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tableAvailabilitiesService.update(
      id,
      updateTableAvailabilityDto,
      user,
    );
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.tableAvailabilitiesService.remove(id, user);
  }
}
