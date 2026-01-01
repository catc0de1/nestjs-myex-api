import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto';
import { FindUserDto } from '@/modules/users/dtos/find-user.dto';
import { UpdateUserDto } from '@/modules/users/dtos/update-user.dto';
import { UserDto } from '@/modules/users/dtos/user.dto';
import { UsersService } from '@/modules/users/users.service';
import { Serialize } from '@/interceptors/serialize.interceptor';
import type { User } from '@/modules/users/user.entity';
// lorem
@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAllUsers(@Query() query: FindUserDto): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Post()
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.name, body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    // console.log('Handler is running');

    return this.usersService.findOne(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(id);
  }
}
