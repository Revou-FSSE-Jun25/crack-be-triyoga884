import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CoworkingSpaceModule } from './coworking-space/coworking-space.module.js';
import { CustomLoggerModule } from './common/logger/logger.module.js';
import { BookingModule } from './booking/booking.module.js';
import { PaymentModule } from './payment/payment.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    CoworkingSpaceModule,
    CustomLoggerModule,
    BookingModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
