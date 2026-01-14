import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { JwtAuthGuard } from '../auth/jwt.auth-guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { reqProp } from '../common/types/types.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: { user: reqProp },
  ) {
    return this.bookingService.create(createBookingDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  @Roles('USER')
  findAllMyBookings(@Req() req: { user: reqProp }) {
    return this.bookingService.findAllMyBookings(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.bookingService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: reqProp }) {
    return this.bookingService.findOne(id, req.user);
  }

  @Get(':id/availability')
  findUnavailableBookings(@Param('id') coworkingSpaceId: string) {
    return this.bookingService.findUnavailableBookings(coworkingSpaceId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  @Get('workspace/me')
  findBookingsForMyWorkspaces(@Req() req: { user: reqProp }) {
    return this.bookingService.findBookingsForMyWorkspaces(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('workspace/:id')
  findBySpaceId(
    @Param('id') coworkingSpaceId: string,
    @Req() req: { user: reqProp },
  ) {
    return this.bookingService.findByUserAndSpace(req.user, coworkingSpaceId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get('checkout/:id')
  getCheckoutData(@Param('id') id: string, @Req() req: { user: reqProp }) {
    return this.bookingService.getBookingAndWorkspaceById(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: { user: reqProp },
  ) {
    return this.bookingService.update(id, updateBookingDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: reqProp }) {
    return this.bookingService.remove(id, req.user);
  }
}
