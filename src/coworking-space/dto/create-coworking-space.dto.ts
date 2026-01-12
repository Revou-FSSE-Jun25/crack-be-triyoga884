import { IsArray, IsNumber, IsString } from 'class-validator';
import { RoomType } from '../../generated/prisma/enums.js';

export class CreateCoworkingSpaceDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNumber()
  pricePerDay: number;

  @IsNumber()
  capacity: number;

  @IsString()
  type: RoomType;
}
