import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { Authorization } from '@/decorators/authorization.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto';
import { UpdateTaxonomyDto } from './dto/update-taxonomy.dto';
import { Authentication } from '@/decorators/authentication.decorator';
import { GetPaginationTaxonomies } from './dto/get-pagination-taxonomies.dto';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';

@Controller('taxonomies')
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Authorization(SubjectEnum.TAXONOMY, ActionEnum.CREATE)
  @ResponseMessage('Created Taxonomy Success!')
  @Logging('Tạo mới danh mục', ActionLogEnum.CREATE, SubjectEnum.TAXONOMY)
  @Post()
  async create(@Body() dto: CreateTaxonomyDto, @AuthUser() user: UserDocument) {
    return await this.taxonomyService.create(dto, user);
  }

  // @Authorization(SubjectEnum.TAXONOMY, ActionEnum.READ)
  @Authentication()
  @ResponseMessage('Get All Taxonomies Success!')
  @Get('/all')
  async findAll() {
    return await this.taxonomyService.findAll();
  }

  @ResponseMessage('Get All Taxonomies Success!')
  @Get('/browser')
  async findAllByBrowser() {
    return await this.taxonomyService.findAll();
  }

  @Authorization(SubjectEnum.TAXONOMY, ActionEnum.READ)
  @ResponseMessage('Get Taxonomy By ID Success!')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.taxonomyService.findOne(id);
  }

  @Authorization(SubjectEnum.TAXONOMY, ActionEnum.READ)
  @ResponseMessage('Get Pagination Taxonomies Success!')
  @Get()
  async getPagination(@Query() query: GetPaginationTaxonomies) {
    return await this.taxonomyService.getPagination(query);
  }

  @Authorization(SubjectEnum.TAXONOMY, ActionEnum.UPDATE)
  @ResponseMessage('Update Taxonomy Success!')
  @Logging('Cập nhật danh mục', ActionLogEnum.UPDATE, SubjectEnum.TAXONOMY)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaxonomyDto) {
    return await this.taxonomyService.update(id, dto);
  }

  @Authorization(SubjectEnum.TAXONOMY, ActionEnum.DELETE)
  @ResponseMessage('Delete Taxonomy Success!')
  @Logging('Xoá danh mục', ActionLogEnum.DELETE, SubjectEnum.TAXONOMY)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.taxonomyService.delete(id);
    return { message: 'Deleted successfully' };
  }
}
