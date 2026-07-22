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
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { FindAreaDto } from './dto/find-area.dto';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from '@app/decorator/roles.decorator';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @Roles(UserRole.RESTAURANT)
  create(@CurrentUser() user: AuthUser, @Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(user._id, createAreaDto);
  }

  @Get()
  findAll(@Query() query: FindAreaDto) {
    return this.areasService.findAll(query.restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query: FindAreaDto) {
    return this.areasService.findOne(query.restaurantId, id);
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    return this.areasService.update(user._id, id, updateAreaDto);
  }

  @Delete(':id')
  @Roles(UserRole.RESTAURANT)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.areasService.remove(user._id, id);
  }
}
