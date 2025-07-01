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
import { PageService } from './page.service';
import { Authorization } from '@/decorators/authorization.decorator';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { CreatePageDto } from './dto/create-page.dto';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';
import { Authentication } from '@/decorators/authentication.decorator';
import { GetPaginationPages } from './dto/get-pagination-pages.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Authorization(SubjectEnum.PAGE, ActionEnum.CREATE)
  @ResponseMessage('Created Page Success!')
  @Logging('Tạo mới trang', ActionLogEnum.CREATE, SubjectEnum.PAGE)
  @Post()
  async create(@Body() dto: CreatePageDto, @AuthUser() user: UserDocument) {
    return this.pageService.create(dto, user);
  }

  // @Authorization(SubjectEnum.PAGE, ActionEnum.READ)
  @Authentication()
  @ResponseMessage('Get All Pages Success!')
  @Get('/all')
  async findAll() {
    return this.pageService.findAll();
  }

  @ResponseMessage('Get Page By Slug Success!')
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.pageService.getBySlug(slug);
  }

  @Authorization(SubjectEnum.PAGE, ActionEnum.READ)
  @ResponseMessage('Get Page By ID Success!')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @Authorization(SubjectEnum.PAGE, ActionEnum.READ)
  @ResponseMessage('Get Pagination Pages Success!')
  @Get()
  async getPagination(@Query() query: GetPaginationPages) {
    return this.pageService.getPagination(query);
  }

  @Authorization(SubjectEnum.PAGE, ActionEnum.UPDATE)
  @ResponseMessage('Update Page Success!')
  @Logging('Cập nhật trang', ActionLogEnum.UPDATE, SubjectEnum.PAGE)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pageService.update(id, dto);
  }

  @Authorization(SubjectEnum.PAGE, ActionEnum.DELETE)
  @ResponseMessage('Delete Page Success!')
  @Logging('Xoá trang', ActionLogEnum.DELETE, SubjectEnum.PAGE)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.pageService.delete(id);
  }
}
