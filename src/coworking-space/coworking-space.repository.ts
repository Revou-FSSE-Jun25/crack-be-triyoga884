import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCoworkingSpaceDto } from './dto/create-coworking-space.dto.js';
import { UpdateCoworkingSpaceDto } from './dto/update-coworking-space.dto.js';
import { RoomType } from '../generated/prisma/enums.js';

@Injectable()
export class CoworkingSpaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCoworkingSpaceDto, userId: string) {
    return this.prisma.coworkingSpace.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
  }

  async findAll(isVerified: boolean) {
    const result = await this.prisma.coworkingSpace.findMany({
      where: { isVerified },
      include: { owner: { select: { name: true } } },
    });
    return result;
  }

  async getWorkspacesByUserId(id: string) {
    const result = await this.prisma.coworkingSpace.findMany({
      where: { ownerId: id },
      include: { owner: { select: { name: true } } },
    });
    return result;
  }

  findOne(id: string) {
    return this.prisma.coworkingSpace.findUnique({ where: { id } });
  }

  findCoworkingSpaceByQuery(name?: string, type?: RoomType) {
    return this.prisma.coworkingSpace.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        type: { equals: type },
        isActive: true,
        isVerified: true,
      },
    });
  }

  checkOwner(id: string, ownerId: string) {
    return this.prisma.coworkingSpace.findFirst({
      where: { id, ownerId },
    });
  }

  update(id: string, data: UpdateCoworkingSpaceDto) {
    return this.prisma.coworkingSpace.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.coworkingSpace.delete({ where: { id } });
  }

  verifyCoworkingSpace(id: string) {
    return this.prisma.coworkingSpace.update({
      where: { id },
      data: { isVerified: true },
    });
  }
}
