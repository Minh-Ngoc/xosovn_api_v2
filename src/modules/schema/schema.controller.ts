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
import { SchemaService } from './schema.service';
import { Authorization } from '@/decorators/authorization.decorator';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { Authentication } from '@/decorators/authentication.decorator';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { GetPaginationSchemas } from './dto/get-pagination-schemas.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';

@Controller('schemas')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Authorization(SubjectEnum.SCHEMA, ActionEnum.CREATE)
  @ResponseMessage('Created Schema Success!')
  @Logging('Tạo mới schema', ActionLogEnum.CREATE, SubjectEnum.SCHEMA)
  @Post()
  async create(@Body() dto: CreateSchemaDto, @AuthUser() user: UserDocument) {
    return await this.schemaService.create(dto, user);
  }

  // @Authorization(SubjectEnum.SCHEMA, ActionEnum.READ)
  @Authentication()
  @ResponseMessage('Get All SchemasGetPaginationSchemas Success!')
  @Get('/all')
  async findAll() {
    return await this.schemaService.findAll();
  }

  @Authorization(SubjectEnum.SCHEMA, ActionEnum.READ)
  @ResponseMessage('Get Schema By ID Success!')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.schemaService.findOne(id);
  }

  @Authorization(SubjectEnum.SCHEMA, ActionEnum.READ)
  @ResponseMessage('Get Pagination Schemas Success!')
  @Get()
  async getPagination(@Query() query: GetPaginationSchemas) {
    return await this.schemaService.getPagination(query);
  }

  @Authorization(SubjectEnum.SCHEMA, ActionEnum.UPDATE)
  @ResponseMessage('Update Schema Success!')
  @Logging('Cập nhật schema', ActionLogEnum.UPDATE, SubjectEnum.SCHEMA)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateSchemaDto) {
    return await this.schemaService.update(id, dto);
  }

  @Authorization(SubjectEnum.SCHEMA, ActionEnum.DELETE)
  @ResponseMessage('Delete Schema Success!')
  @Logging('Xoá schema', ActionLogEnum.DELETE, SubjectEnum.SCHEMA)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.schemaService.delete(id);
    return { message: 'Deleted successfully' };
  }
}
