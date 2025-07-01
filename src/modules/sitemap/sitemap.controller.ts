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
import { SitemapService } from './sitemap.service';
import { Authorization } from '@/decorators/authorization.decorator';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { UserDocument } from '../user/user.entity';
import { Authentication } from '@/decorators/authentication.decorator';
import { GetPaginationSitemaps } from './dto/get-pagination-sitemaps.dto';
import { UpdateSitemapDto } from './dto/update-sitemaps.dto';
import { CreateSitemapDto } from './dto/create-sitemap.dto';
import { AuthUser } from '@/decorators/auth-user.decorator';

@Controller('sitemaps')
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Authorization(SubjectEnum.SITEMAP, ActionEnum.CREATE)
  @ResponseMessage('Created Sitemap Success!')
  @Logging('Tạo mới danh mục', ActionLogEnum.CREATE, SubjectEnum.SITEMAP)
  @Post()
  async create(@Body() dto: CreateSitemapDto, @AuthUser() user: UserDocument) {
    return await this.sitemapService.create(dto, user);
  }

  // @Authorization(SubjectEnum.SITEMAP, ActionEnum.READ)
  @Authentication()
  @ResponseMessage('Get All Sitemaps Success!')
  @Get('/all')
  async findAll() {
    return await this.sitemapService.findAll();
  }

  @Authorization(SubjectEnum.SITEMAP, ActionEnum.READ)
  @ResponseMessage('Get Sitemap By ID Success!')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.sitemapService.findOne(id);
  }

  @Authorization(SubjectEnum.SITEMAP, ActionEnum.READ)
  @ResponseMessage('Get Pagination Sitemaps Success!')
  @Get()
  async getPagination(@Query() query: GetPaginationSitemaps) {
    return await this.sitemapService.getPagination(query);
  }

  @Authorization(SubjectEnum.SITEMAP, ActionEnum.UPDATE)
  @ResponseMessage('Update Sitemap Success!')
  @Logging('Cập nhật danh mục', ActionLogEnum.UPDATE, SubjectEnum.SITEMAP)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateSitemapDto) {
    return await this.sitemapService.update(id, dto);
  }

  @Authorization(SubjectEnum.SITEMAP, ActionEnum.DELETE)
  @ResponseMessage('Delete Sitemap Success!')
  @Logging('Xoá danh mục', ActionLogEnum.DELETE, SubjectEnum.SITEMAP)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.sitemapService.delete(id);
    return { message: 'Deleted successfully' };
  }
}
