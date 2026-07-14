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
import { UsersService } from './users.service';
import { UserReindexService } from './user-reindex.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage } from '@app/decorator/customize';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserRoleAdminDto } from './dto/update-user-role-admin.dto';
import { Roles } from '@app/decorator/roles.decorator';
import { UserRole } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userReindexService: UserReindexService,
  ) {}

  @Get('me')
  @ResponseMessage('Lấy thông tin người dùng thành công')
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.getMe(user._id);
  }

  @Patch('me')
  @ResponseMessage('Cập nhật thông tin người dùng thành công')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(user._id, dto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    console.log('CreateUserDto:', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: FindUserDto) {
    return this.usersService.findAll(query);
  }

  //check
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch(':_id')
  @Roles(UserRole.ADMIN)
  update(@Param('_id') _id: string, @Body() dto: UpdateUserRoleAdminDto) {
    return this.usersService.update(_id, dto);
  }

  @Post(':_id/active')
  @Roles(UserRole.ADMIN)
  activateUser(@Param('_id') _id: string) {
    return this.usersService.activateUser(_id);
  }

  @Post(':_id/inactive')
  @Roles(UserRole.ADMIN)
  inactiveUser(@Param('_id') _id: string) {
    return this.usersService.inactiveUser(_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('test-search/:id')
  @Public()
  async test(@Param('id') id: string) {
    return this.usersService.test(id);
  }

  @Get('search')
  @Public()
  async search(@Query('keyword') keyword: string) {
    return this.usersService.search(keyword);
  }

  @Post('reindex')
  @Public()
  async reindex() {
    return this.userReindexService.reindex();
  }
}
