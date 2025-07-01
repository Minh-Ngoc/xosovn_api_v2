import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Taxonomy, TaxonomyDocument } from './taxonomy.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto';
import { UpdateTaxonomyDto } from './dto/update-taxonomy.dto';
import { GetPaginationTaxonomies } from './dto/get-pagination-taxonomies.dto';
import { UserDocument } from '../user/user.entity';

@Injectable()
export class TaxonomyService {
  constructor(
    @InjectModel(Taxonomy.name)
    private readonly taxonomyModel: Model<TaxonomyDocument>,
  ) {}

  async create(
    createDto: CreateTaxonomyDto,
    user: UserDocument,
  ): Promise<{ taxonomy: Taxonomy }> {
    const existing = await this.taxonomyModel.findOne({
      tax_name: createDto?.tax_name?.trim(),
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: 7,
          message: `Already Exist ${createDto?.tax_name}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const created = await this.taxonomyModel.create({
      ...createDto,
      createdBy: user?._id,
    });

    return { taxonomy: created };
  }

  async getPagination(query: GetPaginationTaxonomies): Promise<{
    taxonomies: Taxonomy[];
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
          tax_name: {
            $regex: new RegExp(search, 'i'),
          },
        },
        {
          tax_slug: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    const total = await this.taxonomyModel.countDocuments(filter);
    const data = await this.taxonomyModel
      .find(filter)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .exec();

    const totalPages = Math.ceil(total / pageSize);

    return {
      taxonomies: data,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findAll(): Promise<{ taxonomies: Taxonomy[] }> {
    const taxonomies = await this.taxonomyModel.find().exec();

    return { taxonomies };
  }

  async findOne(id: string): Promise<{ taxonomy: Taxonomy }> {
    const taxonomy = await this.taxonomyModel.findById(id).exec();

    if (!taxonomy) {
      throw new NotFoundException(`Taxonomy with id ${id} not found`);
    }

    return { taxonomy };
  }

  async update(
    id: string,
    updateDto: UpdateTaxonomyDto,
  ): Promise<{ taxonomy: Taxonomy }> {
    if (updateDto.tax_name) {
      const existing = await this.taxonomyModel.findOne({
        tax_name: updateDto?.tax_name?.trim(),
      });

      if (existing && existing._id.toString() !== id) {
        throw new HttpException(
          {
            statusCode: 7,
            message: `Already Exist ${updateDto?.tax_name}!`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updated = await this.taxonomyModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Taxonomy with id ${id} not found`);
    }

    return { taxonomy: updated };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.taxonomyModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Taxonomy with id ${id} not found`);
    }

    return { success: true };
  }

  async findBySlug(slug: string) {
    return await this.taxonomyModel.findOne({ tax_slug: slug }).lean()
  }
}
