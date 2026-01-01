import { IsBoolean } from 'class-validator';

export class ApproveItemDto {
  @IsBoolean()
  approved: boolean;
}
