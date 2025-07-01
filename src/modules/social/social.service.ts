import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Social, SocialDocument } from './social.entity';
import { Model } from 'mongoose';
import { CreateSocialDto } from './dto/create-social.dto';
import { GetPaginationSocials } from './dto/get-pagination-socials.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class SocialService {
  constructor(
    @InjectModel(Social.name)
    private readonly socialModel: Model<SocialDocument>,

    private readonly storeService: StorageService,
  ) {}

  async create(
    createDto: CreateSocialDto,
    icon: Express.Multer.File,
  ): Promise<{ social: Social }> {
    const payload = {
      ...createDto,
      name: createDto?.name?.trim(),
    };

    const existing = await this.socialModel.findOne({
      name: payload?.name,
    });

    if (existing) {
      throw new HttpException(
        {
          statusCode: 11,
          message: `Already Exist ${payload?.name}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (icon) {
      const filePath = this.storeService.saveImage(
        icon.buffer,
        icon.originalname,
      );

      if (filePath) {
        payload['icon'] = filePath;
      }
    }

    const created = await this.socialModel.create(payload);

    return { social: created };
  }

  async getPagination(query: GetPaginationSocials): Promise<{
    socials: Social[];
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
          name: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    const total = await this.socialModel.countDocuments(filter);
    const data = await this.socialModel
      .find(filter)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .exec();

    const totalPages = Math.ceil(total / pageSize);

    return {
      socials: data,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findAll(): Promise<{ socials: Social[] }> {
    const socials = await this.socialModel.find().exec();

    return { socials };
  }

  async findOne(id: string): Promise<{ social: Social }> {
    const social = await this.socialModel.findById(id).exec();

    if (!social) {
      throw new NotFoundException(`Social with id ${id} not found`);
    }

    return { social };
  }

  async update(
    id: string,
    updateDto: UpdateSocialDto,
    icon: Express.Multer.File,
  ): Promise<{ social: Social }> {
    const payload: any = {
      ...updateDto,
      name: updateDto?.name?.trim(),
    };

    const existing = await this.socialModel.findOne({
      name: payload?.name,
    });

    if (existing && existing._id.toString() !== id) {
      throw new HttpException(
        {
          statusCode: 11,
          message: `Already Exist ${payload?.name}!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (icon) {
      const newFilePath = this.storeService.saveImage(
        icon.buffer,
        icon.originalname,
      );

      if (newFilePath) {
        payload['icon'] = newFilePath;

        // Remove old image if it exists
        if (existing?.icon) {
          this.storeService.removeImage(existing?.icon);
        }
      }
    }

    const updated = await this.socialModel
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Social with id ${id} not found`);
    }

    return { social: updated };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.socialModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Social with id ${id} not found`);
    }

    return { success: true };
  }
}
