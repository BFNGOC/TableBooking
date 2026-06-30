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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage } from '@app/decorator/customize';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('CreateUserDto:', createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() query: Record<string, any>,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
