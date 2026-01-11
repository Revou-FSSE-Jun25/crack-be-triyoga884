import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service.js';
import { PaymentController } from './payment.controller.js';
import { PaymentRepository } from './payment.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BookingModule } from '../booking/booking.module.js';

@Module({
  imports: [PrismaModule, BookingModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
