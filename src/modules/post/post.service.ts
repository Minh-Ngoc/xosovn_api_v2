import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument, PostStatusEnum } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UserDocument } from '../user/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPaginationPostsDto } from './dto/get-pagination-posts.dto';
import { adminRole } from '@/constants';
import { StorageService } from '../storage/storage.service';
import { SchemaService } from '../schema/schema.service';
import { Schema } from '../schema/schema.entity';
import { getSelectData } from '@/common/get-info-data';
import { GetPaginationPostsBrowserDto } from './dto/get-pagination-posts-browser.dto';
import { TaxonomyService } from '../taxonomy/taxonomy.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,

    private readonly storeService: StorageService,

    private readonly schemaService: SchemaService,

    private readonly taxonomyService: TaxonomyService,
  ) {}

  generateBlogPostingSchema(post: any) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post?.post_title,
      image: post?.post_image,
      author: {
        '@type': 'Person',
        name: 'Gofiber Admin',
      },
      datePublished: post?.createdAt,
      dateModified: post?.updatedAt,
      articleBody: post?.post_content,
    };
  }

  async create(
    dto: CreatePostDto,
    file: Express.Multer.File,
    user: UserDocument,
  ): Promise<{ post: Post }> {
    const convertedDto: any = {
      ...dto,
      post_taxid: new Types.ObjectId(dto.post_taxid),
      updatedBy: user?._id,
      createdBy: user?._id,
    };

    if (file) {
      const filePath = this.storeService.saveImage(
        file.buffer,
        file.originalname,
      );

      if (filePath) {
        convertedDto['post_image'] = filePath;
      }
    }

    // if (dto.schema_id) {
    //   convertedDto['schema_id'] = dto.schema_id?.map(
    //     (id) => new Types.ObjectId(id),
    //   );
    // }

    const createPost = (await this.postModel.create(convertedDto)).toObject();
    const result: any = {
      ...createPost,
    };

    if (createPost) {
      const blogSchema = this.generateBlogPostingSchema(createPost);

      const createSchema = await this.schemaService.create(
        {
          schema_name: `BlogPosting - ${createPost?.post_slug}`,
          schema_script: JSON.stringify(blogSchema),
          post_id: createPost?._id?.toString(),
        },
        user,
      );

      result.schema = {
        schema: createSchema,
      };
    }

    return { post: result };
  }

  async getPagination(
    dto: GetPaginationPostsDto,
    user: UserDocument,
  ): Promise<{
    posts: Post[];
    total: number;
    totalPages: number;
    pageIndex: number;
    pageSize: number;
  }> {
    const { pageIndex, pageSize, search, post_taxid, post_status } = dto;
    const filter: any = {};

    if (user?.role?._id !== new Types.ObjectId(adminRole)) {
      filter['createdBy'] = user?._id;
    }

    if (search) {
      filter['$or'] = [
        {
          post_title: {
            $regex: new RegExp(search, 'i'),
          },
        },
        {
          post_slug: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    if (post_taxid) {
      filter['post_taxid'] = new Types.ObjectId(post_taxid);
    }

    if (post_status) {
      filter['post_status'] = post_status;
    }

    const skip = (pageIndex - 1) * pageSize;
    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .populate('post_taxid')
        .populate('createdBy')
        .exec(),
      this.postModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      posts,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findAll(): Promise<{ posts: Post[] }> {
    const posts = await this.postModel
      .find()
      .populate('post_taxid')
      .populate('createdBy')
      .exec();

    return { posts };
  }

  async findOne(id: string): Promise<{ post: Post }> {
    const post = await this.postModel
      .findById(id)
      // .populate('post_taxid')
      // .populate('createdBy')
      .exec();

    if (!post) throw new NotFoundException(`Post with id ${id} not found`);

    return { post };
  }

  async getPaginationPostSoMos(dto: GetPaginationPostsDto): Promise<{
    posts: Post[];
    total: number;
    totalPages: number;
    pageIndex: number;
    pageSize: number;
  }> {
    const { pageIndex, pageSize, search } = dto;
    const tax_soMo = await this.taxonomyService.findBySlug('so-mo');

    if (!tax_soMo) {
      return {
        posts: [],
        total: 0,
        totalPages: 0,
        pageIndex,
        pageSize,
      };
    }

    const filter: any = {
      post_taxid: tax_soMo?._id,
    };

    if (search) {
      filter['$or'] = [
        {
          post_title: {
            $regex: new RegExp(search, 'i'),
          },
        },
        {
          post_slug: {
            $regex: new RegExp(search, 'i'),
          },
        },
      ];
    }

    const skip = (pageIndex - 1) * pageSize;
    const [posts, total] = await Promise.all([
      this.postModel.find(filter).skip(skip).limit(pageSize).exec(),
      this.postModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      posts,
      total,
      totalPages,
      pageIndex,
      pageSize,
    };
  }

  async findOneBySlug(slug: string) {
    const result = await this.postModel.findOne({ post_slug: slug }).lean();
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return { result: result };
  }

  async findOneBySlugSEO(slug: string, select: (keyof PostDocument)[]) {
    const result = await this.postModel
      .findOne({ post_slug: slug })
      .select(getSelectData(select))
      .lean();
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return result;
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    file: Express.Multer.File,
    user: UserDocument,
  ): Promise<{ post: Post & { schema: Schema } }> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new BadRequestException('ID Not Found!');
    }

    const convertedDto: any = {
      ...dto,
      updatedBy: user?._id,
    };

    if (dto.post_taxid) {
      convertedDto.post_taxid = new Types.ObjectId(dto.post_taxid);
    }

    if (file) {
      const newFilePath = this.storeService.saveImage(
        file.buffer,
        file.originalname,
      );

      if (newFilePath) {
        convertedDto['post_image'] = newFilePath;

        // Remove old image if it exists
        if (post?.post_image) {
          this.storeService.removeImage(post?.post_image);
        }
      }
    }

    // if (dto.schema_id) {
    //   convertedDto.schema_id = dto.schema_id.map(
    //     (id) => new Types.ObjectId(id),
    //   );
    // }

    const updated = await this.postModel.findByIdAndUpdate(id, convertedDto, {
      new: true,
    });

    if (!updated) throw new NotFoundException(`Post with id ${id} not found`);

    // ======= Cập nhật hoặc tạo schema dạng BlogPosting =======
    const blogSchema = this.generateBlogPostingSchema(updated);

    const { schema: updatedSchema } =
      await this.schemaService.findByPostIdAndUpdate(post?._id, {
        schema_name: `BlogPosting - ${updated?.post_slug}`,
        schema_script: JSON.stringify(blogSchema),
      });

    return {
      post: {
        ...updated.toObject(),
        schema: updatedSchema,
      },
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const post = await this.postModel.findById(id);

    if (!post) throw new NotFoundException(`Post with id ${id} not found`);

    await this.postModel.deleteOne({ _id: post?._id });

    if (post?.post_image) {
      this.storeService.removeImage(post?.post_image);
    }

    await this.schemaService.deleteByPostId(post?._id);

    return { success: true };
  }

  async getList(query: GetPaginationPostsBrowserDto) {
    const { pageIndex, pageSize, tax_slug } = query;
    const limit = pageSize ? pageSize : null;
    const skip = pageIndex ? pageSize * (pageIndex - 1) : null;

    const filter: any = {};

    if (tax_slug) {
      const tax = await this.taxonomyService.findBySlug(tax_slug);
      console.log(tax);
      if (!tax) {
        throw new NotFoundException('Page not found');
      }
      filter['post_taxid'] = tax._id;
    }

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .select('post_title post_description post_image post_slug')
        .exec(),
      this.postModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      totalPages: totalPages,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getListHotForSidebar(query: GetPaginationPostsBrowserDto) {
    const result = await this.postModel
      .find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('post_title post_slug')
      .lean();
    return { result };
  }

  async approve(id: string, user: UserDocument) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new BadRequestException('ID Not Found!');
    }

    const roleName = ((user as any)?.role?.name as string)?.toLowerCase();
    if (!['supper admin', 'seo leader']?.includes(roleName)) {
      throw new ForbiddenException('Users are not SEO leaders!');
    }

    post.post_status = PostStatusEnum.PUBLIC;
    post.reviewer = user?._id;

    await post.save();

    return { post };
  }

  async reject(id: string, user: UserDocument) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new BadRequestException('ID Not Found!');
    }

    const roleName = ((user as any)?.role?.name as string)?.toLowerCase();
    if (!['supper admin', 'seo leader']?.includes(roleName)) {
      throw new ForbiddenException('Users are not SEO leaders!');
    }

    post.post_status = PostStatusEnum.REJECT;
    post.reviewer = user?._id;

    await post.save();

    return { post };
  }
}
