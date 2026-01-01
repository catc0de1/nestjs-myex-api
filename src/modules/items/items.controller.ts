import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from '@/modules/items/items.service';
import { CreateItemDto } from '@/modules/items/dtos/create-item.dto';
import { Item } from '@/modules/items/item.entity';
import { User } from '@/modules/users/user.entity';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentSession } from '@/modules/auth/decorators/current-session.decorator';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { ItemDto } from './dtos/item.dto';
import { ApproveItemDto } from './dtos/approve-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import { AdminGuard } from '@/guards/admin.guard';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  @Serialize(ItemDto)
  findAllItems(@Query() query: QueryItemDto): Promise<Item[]> {
    return this.itemsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  createItem(
    @Body() body: CreateItemDto,
    @CurrentSession() user: User,
  ): Promise<Item> {
    return this.itemsService.create(body, user);
  }

  @Get('/:id')
  @Serialize(ItemDto)
  findItem(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveItemDto,
  ) {
    return this.itemsService.approveItem(id, body.approved);
  }
}
