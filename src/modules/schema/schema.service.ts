import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schema, SchemaDocument } from './schema.entity';
import { Model, Types } from 'mongoose';
import { UserDocument } from '../user/user.entity';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { GetPaginationSchemas } from './dto/get-pagination-schemas.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';

@Injectable()
export class SchemaService {
  constructor(
    @InjectModel(Schema.name)
    private readonly schemaModel: Model<SchemaDocument>,
  ) {}

  async create(
    createDto: CreateSchemaDto,
    user: UserDocument,
  ): Promise<{ schema: Schema }> {
    const existing = await this.schemaModel.findOne({
      schema_name: createDto?.schema_name?.trim(),
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: 8,
          message: `Already Exist ${createDto?.schema_name}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const created = await this.schemaModel.create({
      ...createDto,
      post_id: new Types.ObjectId(createDto?.post_id),
      createdBy: user?._id,
    });

    const schema = await this.schemaModel.findById(created?._id).populate([
      { path: 'post_id', select: 'post_title' },
      { path: 'page_id', select: 'slug title' },
    ]);

    return { schema };
  }

  async getPagination(query: GetPaginationSchemas): Promise<{
    schemas: Schema[];
    total: number;
    totalPages: number;
    pageIndex: number;
    pageSize: number;
  }> {
    const { pageIndex = 1, pageSize = 10, search } = query;
    const filter: any = {};

    if (search) {
      filter['$or'] = [
        {
          schema_name: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    const total = await this.schemaModel.countDocuments(filter);
    const data = await this.schemaModel
      .find(filter)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate('post_id')
      .populate('page_id')
      .exec();

    const totalPages = Math.ceil(total / pageSize);

    return {
      schemas: data,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findAll(): Promise<{ schemas: Schema[] }> {
    const schemas = await this.schemaModel.find().exec();

    return { schemas };
  }

  async findOne(id: string): Promise<{ schema: Schema }> {
    const schema = await this.schemaModel.findById(id).exec();

    if (!schema) {
      throw new NotFoundException(`Schema with id ${id} not found`);
    }

    return { schema };
  }

  async update(
    id: string,
    updateDto: UpdateSchemaDto,
  ): Promise<{ schema: Schema }> {
    if (updateDto.schema_name) {
      const existing = await this.schemaModel.findOne({
        schema_name: updateDto?.schema_name?.trim(),
      });

      if (existing && existing._id.toString() !== id) {
        throw new HttpException(
          {
            statusCode: 8,
            message: `Already Exist ${updateDto?.schema_name}!`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updated = await this.schemaModel
      .findByIdAndUpdate(
        id,
        {
          ...updateDto,
          post_id: new Types.ObjectId(updateDto?.post_id),
        },
        {
          new: true,
        },
      )
      .populate([
        { path: 'post_id', select: 'post_title' },
        { path: 'page_id', select: 'slug title' },
      ])
      .exec();

    if (!updated) {
      throw new NotFoundException(`Schema with id ${id} not found`);
    }

    return { schema: updated };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.schemaModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Schema with id ${id} not found`);
    }

    return { success: true };
  }

  async deleteByPostId(postId: Types.ObjectId) {
    await this.schemaModel.deleteOne({
      post_id: postId,
    });

    return { success: true };
  }

  async findByPostIdAndUpdate(
    postId: Types.ObjectId,
    updateDto: UpdateSchemaDto,
  ) {
    const updatedSchema = await this.schemaModel.findOneAndUpdate(
      { post_id: postId },
      {
        schema_name: updateDto.schema_name,
        schema_script:
          typeof updateDto.schema_script === 'string'
            ? updateDto.schema_script
            : JSON.stringify(updateDto.schema_script),
      },
      { new: true, upsert: true },
    );

    return { success: true, schema: updatedSchema?.toObject() };
  }
}
