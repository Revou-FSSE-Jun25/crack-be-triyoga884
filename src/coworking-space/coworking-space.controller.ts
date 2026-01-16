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
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { CoworkingSpaceService } from './coworking-space.service.js';
import { CreateCoworkingSpaceDto } from './dto/create-coworking-space.dto.js';
import { UpdateCoworkingSpaceDto } from './dto/update-coworking-space.dto.js';
import { JwtAuthGuard } from '../auth/jwt.auth-guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import type { reqProp } from '../common/types/types.js';
import { RoomType } from '../generated/prisma/enums.js';

@Controller('workspaces')
export class CoworkingSpaceController {
  constructor(private readonly coworkingSpaceService: CoworkingSpaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  create(
    @Body() createCoworkingSpaceDto: CreateCoworkingSpaceDto,
    @Req() req: { user: reqProp },
  ) {
    return this.coworkingSpaceService.create(createCoworkingSpaceDto, req.user);
  }

  @Get('search')
  findByQuery(@Query('name') name: string, @Query('type') type: RoomType) {
    return this.coworkingSpaceService.findCoworkingSpaceByQuery(name, type);
  }

  @Get()
  findAll(@Query('isVerified', ParseBoolPipe) isVerified: boolean) {
    return this.coworkingSpaceService.findAll(isVerified);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coworkingSpaceService.findOne(id);
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROVIDER')
  getWorkspacesByUserId(@Param('id') id: string) {
    return this.coworkingSpaceService.getWorkspacesByUserId(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROVIDER')
  update(
    @Param('id') id: string,
    @Body() updateCoworkingSpaceDto: UpdateCoworkingSpaceDto,
    @Req() req: { user: reqProp },
  ) {
    return this.coworkingSpaceService.update(
      id,
      updateCoworkingSpaceDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROVIDER')
  remove(@Param('id') id: string, @Req() req: { user: reqProp }) {
    return this.coworkingSpaceService.remove(id, req.user);
  }
}
