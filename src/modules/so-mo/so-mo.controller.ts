import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SoMoService } from './so-mo.service';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { Authorization } from '@/decorators/authorization.decorator';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';
import { CreateSoMoDto } from './dto/create-so-mo.dto';
import { UpdateSoMoDto } from './dto/update-so-mo.dto';
import { GetPaginationSoMos } from './dto/get-pagination-so-mos.dto';

@Controller('so-mos')
export class SoMoController {
  constructor(private readonly soMoService: SoMoService) {}

  @ResponseMessage('Get Pagination So Mo Success!')
  @Get('client')
  async getPaginationClient(@Query() query: GetPaginationSoMos) {
    return await this.soMoService.getPagination(query);
  }

  @Authorization(SubjectEnum.SOMO, ActionEnum.CREATE)
  @ResponseMessage('Created So Mo Success!')
  @Logging('Tạo mới sổ mơ', ActionLogEnum.CREATE, SubjectEnum.SOMO)
  @Post()
  async create(@Body() dto: CreateSoMoDto, @AuthUser() user: UserDocument) {
    return await this.soMoService.create(dto, user);
  }

  @Authorization(SubjectEnum.SOMO, ActionEnum.READ)
  @ResponseMessage('Get SoMo By ID Success!')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.soMoService.findOne(id);
  }

  @Authorization(SubjectEnum.SOMO, ActionEnum.READ)
  @ResponseMessage('Get Pagination So Mo Success!')
  @Get()
  async getPagination(@Query() query: GetPaginationSoMos) {
    return await this.soMoService.getPagination(query);
  }

  @Authorization(SubjectEnum.SOMO, ActionEnum.UPDATE)
  @ResponseMessage('Update So Mo Success!')
  @Logging('Cập nhật sổ mơ', ActionLogEnum.UPDATE, SubjectEnum.SOMO)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateSoMoDto) {
    return await this.soMoService.update(id, dto);
  }

  @Authorization(SubjectEnum.SOMO, ActionEnum.DELETE)
  @ResponseMessage('Delete So Mo Success!')
  @Logging('Xoá sổ mơ', ActionLogEnum.DELETE, SubjectEnum.SOMO)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.soMoService.delete(id);
    return { message: 'Deleted successfully' };
  }
}
