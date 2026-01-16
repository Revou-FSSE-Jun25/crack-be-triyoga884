import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCoworkingSpaceDto } from './dto/create-coworking-space.dto.js';
import { UpdateCoworkingSpaceDto } from './dto/update-coworking-space.dto.js';
import { CoworkingSpaceRepository } from './coworking-space.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { RoomType, UserRole } from '../generated/prisma/enums.js';

@Injectable()
export class CoworkingSpaceService {
  constructor(
    private readonly repo: CoworkingSpaceRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    createCoworkingSpaceDto: CreateCoworkingSpaceDto,
    user: { userId: string; role: UserRole },
  ) {
    const userValidate = await this.userRepository.findOne(user.userId);
    if (!userValidate) {
      throw new NotFoundException('Account not found');
    }
    if (user.role === UserRole.ADMIN || userValidate.role === UserRole.USER) {
      throw new ForbiddenException(
        'You are not allowed to create coworking space',
      );
    }
    return this.repo.create(createCoworkingSpaceDto, user.userId);
  }

  async getWorkspacesByUserId(id: string) {
    const user = await this.repo.getWorkspacesByUserId(id);
    if (!user) {
      throw new NotFoundException('Account not found');
    }
    return user;
  }

  async findAll(isVerified: boolean) {
    const workspaces = await this.repo.findAll(isVerified);
    if (!workspaces) throw new NotFoundException('No coworking spaces found');
    return workspaces;
  }

  async findOne(id: string) {
    const workspaces = await this.repo.findOne(id);
    if (!workspaces) throw new NotFoundException('No coworking spaces found');
    return workspaces;
  }

  async findCoworkingSpaceByQuery(name: string, type: RoomType) {
    const workspaces = await this.repo.findCoworkingSpaceByQuery(name, type);
    if (workspaces.length === 0)
      throw new NotFoundException('No coworking spaces found');
    return workspaces;
  }

  async update(
    id: string,
    updateCoworkingSpaceDto: UpdateCoworkingSpaceDto,
    user: { userId: string; role: UserRole },
  ) {
    const workspace = await this.repo.findOne(id);
    if (!workspace) {
      throw new NotFoundException('Coworking space not found');
    }
    if (user.role !== UserRole.ADMIN && workspace.ownerId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to update this coworking space',
      );
    }
    return this.repo.update(id, updateCoworkingSpaceDto);
  }

  async remove(id: string, user: { userId: string; role: UserRole }) {
    const workspace = await this.repo.findOne(id);
    if (!workspace) {
      throw new NotFoundException('Coworking space not found');
    }
    if (user.role !== UserRole.ADMIN && workspace.ownerId !== user.userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this coworking space',
      );
    }
    return this.repo.delete(id);
  }

  async verifyCoworkingSpace(id: string) {
    const workspace = await this.repo.findOne(id);
    if (!workspace) {
      throw new NotFoundException('Coworking space not found');
    }
    return this.repo.verifyCoworkingSpace(id);
  }
}
