import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { UserRepository } from '../user/user.repository.js';
import { BookingRepository } from './booking.repository.js';
import { CoworkingSpaceRepository } from '../coworking-space/coworking-space.repository.js';

@Injectable()
export class BookingService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly coworkingSpaceRepo: CoworkingSpaceRepository,
    private readonly repo: BookingRepository,
  ) {}
  async create(
    createBookingDto: CreateBookingDto,
    user: { userId: string; role: string },
  ) {
    const checkUser = await this.userRepo.findOne(user.userId);
    if (!checkUser) {
      throw new NotFoundException('User not found');
    }
    const checkCoworkingSpace = await this.coworkingSpaceRepo.findOne(
      createBookingDto.coworkingSpaceId,
    );
    if (!checkCoworkingSpace) {
      throw new NotFoundException('Coworking space not found');
    }
    if (checkCoworkingSpace.isActive === false) {
      throw new BadRequestException('Coworking space is not active');
    }
    if (checkCoworkingSpace.isVerified === false) {
      throw new BadRequestException('Coworking space is not verified');
    }
    if (user.role !== 'USER') {
      throw new BadRequestException(
        'Only users with USER role can create bookings',
      );
    }

    const price = checkCoworkingSpace.pricePerDay;
    const totalDays = this.calculateDays(
      new Date(createBookingDto.startDate),
      new Date(createBookingDto.endDate),
    );
    const totalPrice = price * totalDays;
    return this.repo.createBooking(createBookingDto, user.userId, totalPrice);
  }

  findUnavailableBookings(coworkingSpaceId: string) {
    return this.repo.findUnavailableBookings(coworkingSpaceId);
  }

  async findAll() {
    const result = await this.repo.findAll();
    if (!result) {
      throw new NotFoundException('No bookings found');
    }
    return result;
  }

  async findOne(id: string, user: { userId: string; role: string }) {
    const result = await this.repo.findOne(id);
    if (!result) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    if (user.role !== 'ADMIN' && result.userId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to access this booking',
      );
    }
    return result;
  }

  async findAllMyBookings(userId: string) {
    const result = await this.repo.findAllMyBookings(userId);
    if (!result) {
      throw new NotFoundException('No bookings found for this user');
    }
    return result;
  }

  async findByUserAndSpace(
    user: { userId: string; role: string },
    coworkingSpaceId: string,
  ) {
    if (user.role !== 'PROVIDER') {
      throw new ForbiddenException(
        'You are not allowed to access bookings for this coworking space',
      );
    }
    const space = await this.coworkingSpaceRepo.checkOwner(
      coworkingSpaceId,
      user.userId,
    );
    if (!space) {
      throw new ForbiddenException(
        'You are not allowed to access bookings for this coworking space',
      );
    }
    return this.repo.findBySpaceId(coworkingSpaceId);
  }

  async getBookingAndWorkspaceById(id: string, userId: string) {
    const data = await this.repo.getBookingAndWorkSpaceById(id);
    if (!data)
      throw new NotFoundException('Booking and Workspace data not found!');
    if (data.userId !== userId)
      throw new ForbiddenException(
        'You cant access this Booking and Workspace data',
      );
    return data;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    user: { userId: string; role: string },
  ) {
    const booking = await this.repo.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (user.role !== 'ADMIN' && booking.userId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to update this booking',
      );
    }
    return this.repo.update(id, updateBookingDto);
  }

  async remove(id: string, user: { userId: string; role: string }) {
    const booking = await this.repo.findOne(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (user.role !== 'ADMIN' && booking.userId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this booking',
      );
    }
    return this.repo.delete(id);
  }

  calculateDays(start: Date, end: Date): number {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const startUTC = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );

    const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.floor((endUTC - startUTC) / MS_PER_DAY) + 1;
  }
}
