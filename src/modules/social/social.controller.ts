import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { Authorization } from '@/decorators/authorization.decorator';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { Authentication } from '@/decorators/authentication.decorator';
import { CreateSocialDto } from './dto/create-social.dto';
import { GetPaginationSocials } from './dto/get-pagination-socials.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { FileUploadInterceptor } from '@/interceptors/file-upload.interceptor';

@Controller('socials')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Authorization(SubjectEnum.SOCIAL, ActionEnum.CREATE)
  @ResponseMessage('Created Social Success!')
  @Logging('Tạo mới social', ActionLogEnum.CREATE, SubjectEnum.SOCIAL)
  @UseInterceptors(FileUploadInterceptor('icon'))
  @Post()
  async create(
    @Body() dto: CreateSocialDto,
    @UploadedFile() icon: Express.Multer.File,
  ) {
    return await this.socialService.create(dto, icon);
  }

  // @Authorization(SubjectEnum.SOCIAL, ActionEnum.READ)
  @Authentication()
  @ResponseMessage('Get All Socials Success!')
  @Get('/all')
  async findAll() {
    return await this.socialService.findAll();
  }

  @Authorization(SubjectEnum.SOCIAL, ActionEnum.READ)
  @ResponseMessage('Get Social By ID Success!')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.socialService.findOne(id);
  }

  @Authorization(SubjectEnum.SOCIAL, ActionEnum.READ)
  @ResponseMessage('Get Pagination Socials Success!')
  @Get()
  async getPagination(@Query() query: GetPaginationSocials) {
    return await this.socialService.getPagination(query);
  }

  @Authorization(SubjectEnum.SOCIAL, ActionEnum.UPDATE)
  @ResponseMessage('Update Social Success!')
  @Logging('Cập nhật social', ActionLogEnum.UPDATE, SubjectEnum.SOCIAL)
  @UseInterceptors(FileUploadInterceptor('icon'))
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSocialDto,
    @UploadedFile() icon: Express.Multer.File,
  ) {
    return await this.socialService.update(id, dto, icon);
  }

  @Authorization(SubjectEnum.SOCIAL, ActionEnum.DELETE)
  @ResponseMessage('Delete Social Success!')
  @Logging('Xoá social', ActionLogEnum.DELETE, SubjectEnum.SOCIAL)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.socialService.delete(id);
    return { message: 'Deleted successfully' };
  }
}
