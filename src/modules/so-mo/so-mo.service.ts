import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoMo, SoMoDocument } from './so-mo.entity';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.entity';
import { CreateSoMoDto } from './dto/create-so-mo.dto';
import { GetPaginationSoMos } from './dto/get-pagination-so-mos.dto';
import { UpdateSoMoDto } from './dto/update-so-mo.dto';

@Injectable()
export class SoMoService {
  constructor(
    @InjectModel(SoMo.name)
    private readonly soMoModel: Model<SoMoDocument>,
  ) {}

  async create(
    createDto: CreateSoMoDto,
    user: UserDocument,
  ): Promise<{ soMo: SoMo }> {
    const payload = {
      ...createDto,
      title: createDto?.title?.trim(),
      createdBy: user?._id,
    };

    const existing = await this.soMoModel.findOne({
      title: payload?.title,
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: 12,
          message: `Already Exist ${payload?.title}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const created = await this.soMoModel.create(payload);

    const soMo = await this.soMoModel.findById(created?._id).populate('post');

    return { soMo };
  }

  async getPagination(query: GetPaginationSoMos): Promise<{
    soMos: SoMo[];
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
          title: {
            $regex: new RegExp(search, 'i'),
          },
        },
        {
          numbers: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    const total = await this.soMoModel.countDocuments(filter);
    const data = await this.soMoModel
      .find(filter)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate([{ path: 'post', select: 'post_title post_slug -_id' }])
      .exec();

    const totalPages = Math.ceil(total / pageSize);

    return {
      soMos: data,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findAll(): Promise<{ soMos: SoMo[] }> {
    const soMos = await this.soMoModel.find().exec();

    return { soMos };
  }

  async findOne(id: string): Promise<{ soMo: SoMo }> {
    const soMo = await this.soMoModel.findById(id).exec();

    if (!soMo) {
      throw new NotFoundException(`So Mo with id ${id} not found`);
    }

    return { soMo };
  }

  async update(id: string, updateDto: UpdateSoMoDto): Promise<{ soMo: SoMo }> {
    const payload: any = {
      ...updateDto,
      title: updateDto?.title?.trim(),
    };

    const existing = await this.soMoModel.findOne({
      title: payload?.title,
    });

    if (existing && existing._id.toString() !== id) {
      throw new HttpException(
        {
          statusCode: 12,
          message: `Already Exist ${payload?.title}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated = await this.soMoModel
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`SoMo with id ${id} not found`);
    }

    const soMo = await this.soMoModel.findById(id).populate('post');

    return { soMo };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.soMoModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`SoMo with id ${id} not found`);
    }

    return { success: true };
  }
}
