import { IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../../generated/prisma/enums.js';

export class CreateBookingDto {
  @IsString()
  startDate: string;
  @IsString()
  endDate: string;
  @IsString()
  coworkingSpaceId: string;
  @IsOptional()
  @IsString()
  status?: BookingStatus;
}
