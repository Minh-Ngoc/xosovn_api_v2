import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from './page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UserDocument } from '../user/user.entity';
import { GetPaginationPages } from './dto/get-pagination-pages.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name)
    private readonly pageModel: Model<PageDocument>,
  ) {}

  async create(
    createDto: CreatePageDto,
    user: UserDocument,
  ): Promise<{ page: Page }> {
    const existing = await this.pageModel.findOne({
      slug: createDto?.slug?.toLowerCase()?.trim(),
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: 9,
          message: `Already Exist ${createDto?.slug}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const created = await this.pageModel.create({
      ...createDto,
      slug: createDto?.slug?.toLowerCase()?.trim(),
      createdBy: user?._id,
    });

    return { page: created };
  }

  async getPagination(query: GetPaginationPages): Promise<{
    pages: Page[];
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
          slug: {
            $regex: new RegExp(search, 'i'),
          },
        },
        {
          title: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    const total = await this.pageModel.countDocuments(filter);
    const data = await this.pageModel
      .find(filter)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .exec();

    const totalPages = Math.ceil(total / pageSize);

    return {
      pages: data,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findAll(): Promise<{ pages: Page[] }> {
    const pages = await this.pageModel.find().exec();

    return { pages };
  }

  async findOne(id: string): Promise<{ page: Page }> {
    const page = await this.pageModel.findById(id).exec();

    if (!page) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }

    return { page };
  }

  async getBySlug(slug: string): Promise<{ page: Page }> {
    if (!slug) {
      throw new BadRequestException('Slug Is Not Empty!');
    }

    const page = await this.pageModel.findOne({ slug: slug?.trim() }).exec();

    if (!page) {
      throw new NotFoundException(`Page with slug: ${slug} not found`);
    }

    return { page };
  }

  async update(id: string, updateDto: UpdatePageDto): Promise<{ page: Page }> {
    if (updateDto?.slug) {
      updateDto.slug = updateDto?.slug?.toLowerCase()?.trim();

      const existing = await this.pageModel.findOne({
        slug: updateDto?.slug,
      });

      if (existing && existing._id.toString() !== id) {
        throw new HttpException(
          {
            statusCode: 9,
            message: `Already Exist ${updateDto?.slug}!`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updated = await this.pageModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }

    return { page: updated };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.pageModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }

    return { success: true };
  }
}
