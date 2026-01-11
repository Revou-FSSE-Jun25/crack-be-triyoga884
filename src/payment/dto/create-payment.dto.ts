import { IsString } from 'class-validator';
import { PaymentMethod } from '../../generated/prisma/enums.js';

export class CreatePaymentDto {
  @IsString()
  method: PaymentMethod;
  @IsString()
  bookingId: string;
}
