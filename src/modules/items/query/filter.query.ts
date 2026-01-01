import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { QueryItemDto } from '../dtos/query-item.dto';

export function applyFilter<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  alias: string,
  filters: QueryItemDto,
): SelectQueryBuilder<T> {
  if (filters.name) {
    query.andWhere(`${alias}.name LIKE :name`, { name: `%${filters.name}%` });
  }

  if (filters.price !== undefined) {
    query.andWhere(`${alias}.price >= :price`, { price: filters.price });
  }

  if (filters.location) {
    query.andWhere(`${alias}.location = :location`, {
      location: filters.location,
    });
  }

  if (filters.category) {
    query.andWhere(`${alias}.category = :category`, {
      category: filters.category,
    });
  }

  return query;
}
