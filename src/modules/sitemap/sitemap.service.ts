import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sitemap, SitemapDocument } from './sitemap.entity';
import { Model } from 'mongoose';
import { CreateSitemapDto } from './dto/create-sitemap.dto';
import { UserDocument } from '../user/user.entity';
import { GetPaginationSitemaps } from './dto/get-pagination-sitemaps.dto';
import { UpdateSitemapDto } from './dto/update-sitemaps.dto';

@Injectable()
export class SitemapService {
  constructor(
    @InjectModel(Sitemap.name)
    private readonly sitemapModel: Model<SitemapDocument>,
  ) {}

  async create(
    createDto: CreateSitemapDto,
    user: UserDocument,
  ): Promise<{ sitemap: Sitemap }> {
    const existing = await this.sitemapModel.findOne({
      loc: createDto?.loc?.trim(),
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: 10,
          message: `Already Exist ${createDto?.loc}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const created = await this.sitemapModel.create({
      ...createDto,
      createdBy: user?._id,
    });

    return { sitemap: created };
  }

  async getPagination(query: GetPaginationSitemaps): Promise<{
    sitemaps: Sitemap[];
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
          loc: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    const total = await this.sitemapModel.countDocuments(filter);
    const data = await this.sitemapModel
      .find(filter)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .exec();

    const totalPages = Math.ceil(total / pageSize);

    return {
      sitemaps: data,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findAll(): Promise<{ sitemaps: Sitemap[] }> {
    const sitemaps = await this.sitemapModel.find().exec();

    return { sitemaps };
  }

  async findOne(id: string): Promise<{ sitemap: Sitemap }> {
    const sitemap = await this.sitemapModel.findById(id).exec();

    if (!sitemap) {
      throw new NotFoundException(`Sitemap with id ${id} not found`);
    }

    return { sitemap };
  }

  async update(
    id: string,
    updateDto: UpdateSitemapDto,
  ): Promise<{ sitemap: Sitemap }> {
    if (updateDto.loc) {
      const existing = await this.sitemapModel.findOne({
        loc: updateDto?.loc?.trim(),
      });

      if (existing && existing._id.toString() !== id) {
        throw new HttpException(
          {
            statusCode: 10,
            message: `Already Exist ${updateDto?.loc}!`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updated = await this.sitemapModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Sitemap with id ${id} not found`);
    }

    return { sitemap: updated };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.sitemapModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Sitemap with id ${id} not found`);
    }

    return { success: true };
  }
}
