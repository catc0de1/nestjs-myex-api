import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import type { Relation } from 'typeorm';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  location: string;

  @Column()
  category: string;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => User, (user) => user.items, { nullable: false })
  user: Relation<User>;
}
