import { Expose, Transform } from 'class-transformer';

export class ItemDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  location: string;

  @Expose()
  category: string;

  @Transform(({ obj }: { obj: { user: { id: number } } }) => obj.user.id)
  @Expose()
  userId: number;

  @Transform(({ obj }: { obj: { user: { name: string } } }) => obj.user.name)
  @Expose()
  userName: string;
}
