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
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from '@app/decorator/roles.decorator';
import { FindAreasDto } from './dto/find-areas.dto';
import { AreaParamDto } from './dto/area-param.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @Roles(UserRole.RESTAURANT)
  create(@Body() createAreaDto: CreateAreaDto, @CurrentUser() user: AuthUser) {
    return this.areasService.create(createAreaDto, user);
  }

  @Get()
  findAll(@Query() findAreasDto: FindAreasDto) {
    return this.areasService.findAll(findAreasDto);
  }

  @Get(':areaId')
  findOne(@Param() params: AreaParamDto) {
    return this.areasService.findOne(params.areaId);
  }

  @Patch(':areaId')
  @Roles(UserRole.RESTAURANT)
  update(
    @Param() params: AreaParamDto,
    @Body() updateAreaDto: UpdateAreaDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.areasService.update(params.areaId, updateAreaDto, user);
  }

  @Delete(':areaId')
  @Roles(UserRole.RESTAURANT)
  remove(@Param() params: AreaParamDto, @CurrentUser() user: AuthUser) {
    return this.areasService.remove(params.areaId, user);
  }
}
