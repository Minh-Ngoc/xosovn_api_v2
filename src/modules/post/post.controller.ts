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
import { PostService } from './post.service';
import { GetPaginationPostsDto } from './dto/get-pagination-posts.dto';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { ActionEnum, ActionLogEnum, SubjectEnum } from '@/enums';
import { Authorization } from '@/decorators/authorization.decorator';
import { Logging } from '@/decorators/logging.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';
import { FileUploadInterceptor } from '@/interceptors/file-upload.interceptor';
import { Authentication } from '@/decorators/authentication.decorator';
import { GetPaginationPostsBrowserDto } from './dto/get-pagination-posts-browser.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Authorization(SubjectEnum.POST, ActionEnum.CREATE)
  @ResponseMessage('Created Post Success!')
  @Logging('Tạo mới bài viết', ActionLogEnum.CREATE, SubjectEnum.POST)
  @Post()
  @UseInterceptors(FileUploadInterceptor('post_image'))
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: UserDocument,
  ) {
    return await this.postService.create(dto, file, user);
  }

  @Get('/so-mo')
  @ResponseMessage('Get Pagination Success!')
  async getPaginationPostSoMos(@Query() query: GetPaginationPostsDto) {
    return await this.postService.getPaginationPostSoMos(query);
  }

  @Authentication()
  @ResponseMessage('Get All Posts Success!')
  @Get('/all')
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('/detail/:slug')
  @ResponseMessage('success!')
  async findPostBySlug(@Param('slug') slug: string) {
    return await this.postService.findOneBySlug(slug);
  }

  @Get('/seo/:slug')
  @ResponseMessage('success!')
  async findPostBySlugSEO(@Param('slug') slug: string) {
    return await this.postService.findOneBySlugSEO(slug, [
      'post_description',
      'post_title',
    ]);
  }

  @ResponseMessage('successss')
  @Get('/lists')
  async getPaginationByBrowser(@Query() query: GetPaginationPostsBrowserDto) {
    return await this.postService.getList(query);
  }

  @ResponseMessage('success')
  @Get('/lists/hot')
  async getListPostHotForSidebar(@Query() query: GetPaginationPostsBrowserDto) {
    return await this.postService.getListHotForSidebar(query);
  }

  @Authorization(SubjectEnum.POST, ActionEnum.READ)
  @ResponseMessage('Get Post By ID Success!')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Authorization(SubjectEnum.POST, ActionEnum.READ)
  @ResponseMessage('Get Pagination Posts Success!')
  @Get()
  async getPagination(
    @Query() query: GetPaginationPostsDto,
    @AuthUser() user: UserDocument,
  ) {
    return await this.postService.getPagination(query, user);
  }

  @Authorization(SubjectEnum.POST, ActionEnum.UPDATE)
  @ResponseMessage('Approve Post Success!')
  @Logging('Duyệt bài viết', ActionLogEnum.UPDATE, SubjectEnum.POST)
  @Put('approve/:id')
  async approve(@Param('id') id: string, @AuthUser() user: UserDocument) {
    return await this.postService.approve(id, user);
  }

  @Authorization(SubjectEnum.POST, ActionEnum.UPDATE)
  @ResponseMessage('Reject Post Success!')
  @Logging('Duyệt bài viết', ActionLogEnum.UPDATE, SubjectEnum.POST)
  @Put('reject/:id')
  async reject(@Param('id') id: string, @AuthUser() user: UserDocument) {
    return await this.postService.reject(id, user);
  }

  @Authorization(SubjectEnum.POST, ActionEnum.UPDATE)
  @ResponseMessage('Update Post Success!')
  @Logging('Cập nhật bài viết', ActionLogEnum.UPDATE, SubjectEnum.POST)
  @UseInterceptors(FileUploadInterceptor('post_image'))
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: UserDocument,
  ) {
    return await this.postService.update(id, dto, file, user);
  }

  @Authorization(SubjectEnum.POST, ActionEnum.DELETE)
  @ResponseMessage('Delete Post Success!')
  @Logging('Xoá post', ActionLogEnum.DELETE, SubjectEnum.POST)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.postService.delete(id);
    return { message: 'Deleted successfully' };
  }
}
