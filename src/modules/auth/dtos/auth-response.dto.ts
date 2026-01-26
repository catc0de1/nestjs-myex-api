import { Expose, Type } from 'class-transformer';
import { UserDto } from '@/modules/users/dtos/user.dto';

export class AuthResponseTokenDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class AuthResponseDataDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => AuthResponseTokenDto)
  token: AuthResponseTokenDto;
}

export class AuthResponseDto {
  @Expose()
  message: string;

  @Expose()
  @Type(() => AuthResponseDataDto)
  data: AuthResponseDataDto;
}
