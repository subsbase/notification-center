import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString({ message: 'apiSecret is required' })
  @IsNotEmpty({ message: 'apiSecret can not be empty' })
  apiSecret: string;
}
