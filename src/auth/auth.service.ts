import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (user) throw new ConflictException('Email already registered');
    return this.userRepository.createUser(data);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: { userId: string; email: string; role: string }) {
    const payload = { sub: user.userId, email: user.email, role: user.role };

    const { access_token, refresh_token, hashedRt } =
      await this.generateToken(payload);

    await this.userRepository.update(user.userId, { refresh_token: hashedRt });

    return {
      access_token,
      refresh_token,
    };
  }

  async userLogin(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new BadRequestException('Email or password invalid');

    const result = await this.login({
      email,
      userId: user.id,
      role: user.role,
    });

    return { message: 'User Login Success', ...result };
  }

  async userLogout(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user || !user.refresh_token)
      throw new BadRequestException('User not found');
    try {
      await this.userRepository.update(id, { refresh_token: null });
      return { message: 'User logout success!' };
    } catch (error) {
      return { message: 'User logout failed!' };
    }
  }

  async refreshToken(token: string) {
    const data = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    const userId = data.sub;
    const user = await this.userRepository.findOne(userId);
    if (!user || !user.refresh_token)
      throw new BadRequestException('Account not found');

    const rtMatches = await bcrypt.compare(token, user.refresh_token);
    if (!rtMatches) throw new ForbiddenException('Refresh Token didnt match');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { refresh_token, access_token, hashedRt } =
      await this.generateToken(payload);

    await this.userRepository.update(user.id, { refresh_token: hashedRt });

    return {
      access_token,
      refresh_token,
      message: 'Refresh Success!',
    };
  }

  async generateToken(payload: { sub: string; email: string; role: string }) {
    const access_token = this.jwtService.sign(payload, { expiresIn: '2h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hashedRt = await bcrypt.hash(refresh_token, 10);
    return { access_token, refresh_token, hashedRt };
  }
}
