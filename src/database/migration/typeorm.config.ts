import 'dotenv/config';
import './env.validator';
import { DataSource } from 'typeorm';
import { Item } from '@/modules/items/item.entity';
import { User } from '@/modules/users/user.entity';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Item],
  migrations: [join(process.cwd(), 'migrations/*.{ts,js}')],
  synchronize: false,
});
