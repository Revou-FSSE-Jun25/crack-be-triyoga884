import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { BookingRepository } from '../booking/booking.repository.js';

@Injectable()
export class PaymentRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingRepo: BookingRepository,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: dto,
    });
    await this.bookingRepo.update(dto.bookingId, { status: 'CONFIRMED' });
    return payment;
  }
}
