import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

@Injectable()
export class BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  createBooking(data: CreateBookingDto, userId: string, totalPrice: number) {
    return this.prisma.booking.create({
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalPrice: totalPrice,
        user: {
          connect: { id: userId },
        },
        coworkingSpace: { connect: { id: data.coworkingSpaceId } },
      },
    });
  }

  findAll() {
    return this.prisma.booking.findMany();
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
    });
  }

  findAllMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
    });
  }

  findUnavailableBookings(coworkingSpaceId: string) {
    return this.prisma.booking.findMany({
      where: { coworkingSpaceId },
      select: { startDate: true, endDate: true },
    });
  }

  findBySpaceId(coworkingSpaceId: string) {
    return this.prisma.booking.findMany({
      where: { coworkingSpaceId },
    });
  }

  getBookingAndWorkSpaceById(id: string) {
    return this.prisma.booking.findFirst({
      where: { id },
      include: {
        coworkingSpace: {
          select: {
            name: true,
            description: true,
            address: true,
            type: true,
            amenities: true,
            pricePerDay: true,
          },
        },
      },
    });
  }

  update(id: string, data: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
