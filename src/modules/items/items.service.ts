import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '@/modules/items/item.entity';
import { CreateItemDto } from '@/modules/items/dtos/create-item.dto';
import { User } from '@/modules/users/user.entity';
import { QueryItemDto } from './dtos/query-item.dto';
import { applyFilter } from './query/filter.query';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  findAll(filters: QueryItemDto): Promise<Item[]> {
    let query = this.itemRepository.createQueryBuilder('item');

    query.where('item.approved = :approved', { approved: true });
    query = applyFilter(query, 'item', filters);

    return query.getMany();
  }

  create(item: CreateItemDto, user: User) {
    const newItem = this.itemRepository.create(item);
    newItem.user = user;
    return this.itemRepository.save(newItem);
  }

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!item) {
      throw new NotFoundException('Item not found!');
    }

    return item;
  }

  async approveItem(id: number, approved: boolean) {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found!');
    }

    item.approved = approved;
    return this.itemRepository.save(item);
  }
}
