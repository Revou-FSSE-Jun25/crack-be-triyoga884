import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { PaymentRepository } from './payment.repository.js';
import { BookingRepository } from '../booking/booking.repository.js';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly bookingRepo: BookingRepository,
  ) {}
  async create(dto: CreatePaymentDto, userId: string) {
    const booking = await this.bookingRepo.findOne(dto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found!');
    if (booking.userId !== userId)
      throw new ForbiddenException('You cant access this booking');
    return this.repo.createPayment(dto);
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
