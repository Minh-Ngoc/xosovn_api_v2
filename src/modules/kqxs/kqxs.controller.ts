import { Controller, Get, Param, Query } from '@nestjs/common';
import { KqxsService } from './kqxs.service';
import { GetKqxsTinhDto } from './dto/get-kqxs-tinh.dto';
import { GetKqxsMienDto } from './dto/get-kqxs-mien.dto';
import { DoVeSoDto } from './dto/do-ve-so.dto';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { GetStatisticDto } from './dto/get-statistic.dto';
import { GetResultTanSuatDto } from './dto/get-result-tan-suat.dto';
import { GetResultFormLoDto } from './dto/get-result-form-lo.dto';
import { GetPaginationKqxsDto } from './dto/get-pagination-kqxs.dto';

@Controller('kqxs')
export class KqxsController {
  constructor(private readonly kqxsService: KqxsService) {}

  @Get('mien-nam/pagination')
  @ResponseMessage('Lấy kết quả xổ số miền Nam thành công')
  getPaginationXsmn(@Query() query: GetPaginationKqxsDto) {
    return this.kqxsService.getPaginationXsmn(query);
  }

  @Get('mien-bac/pagination')
  @ResponseMessage('Lấy kết quả xổ số miền Bắc thành công')
  getPaginationXsmb(@Query() query: GetPaginationKqxsDto) {
    return this.kqxsService.getPaginationXsmb(query);
  }

  @Get('mien-trung/pagination')
  @ResponseMessage('Lấy kết quả xổ số miền Trung thành công')
  getPaginationXsmt(@Query() query: GetPaginationKqxsDto) {
    return this.kqxsService.getPaginationXsmt(query);
  }

  @Get('tinh/pagination')
  @ResponseMessage('Lấy kết quả xổ số tỉnh thành công')
  getPaginationTinh(@Query() query: GetPaginationKqxsDto) {
    return this.kqxsService.getPaginationTinh(query);
  }

  @Get('mien-trung/:ngay')
  @ResponseMessage('Lấy kết quả xổ số miền Trung thành công')
  getXSMT(@Param() { ngay }: GetKqxsMienDto) {
    return this.kqxsService.getXSMT(ngay);
  }

  @Get('mien-nam/:ngay')
  @ResponseMessage('Lấy kết quả xổ số miền Nam thành công')
  getXSMN(@Param() { ngay }: GetKqxsMienDto) {
    return this.kqxsService.getXSMN(ngay);
  }

  @Get('mien-bac/:ngay')
  @ResponseMessage('Lấy kết quả xổ số miền Bắc thành công')
  getXSMB(@Param() { ngay }: GetKqxsMienDto) {
    return this.kqxsService.getXSMB(ngay);
  }

  @Get('tinh')
  @ResponseMessage('Lấy kết quả xổ số tỉnh thành công')
  getKqXsTinh(@Query() query: GetKqxsTinhDto) {
    return this.kqxsService.getKqxsTinh(query);
  }

  @Get('do-ve-so')
  @ResponseMessage('Lấy kết quả dò vé số thành công')
  checkKqxs(@Query() query: DoVeSoDto) {
    return this.kqxsService.checkKqxs(query);
  }

  @Get('thong-ke')
  @ResponseMessage('Lấy số liệu thống kê thành công')
  getStatistic(@Query() query: GetStatisticDto) {
    return this.kqxsService.getStatistic(query);
  }

  @Get('all-by-head/:region')
  @ResponseMessage('Lấy tần suất đầu số theo vùng thành công')
  getAllByHead(@Param('region') region: number) {
    return this.kqxsService.getAllByHead(region);
  }

  @Get('top-by-region/:region')
  @ResponseMessage('Lấy 10 số loto xuất hiện nhiều nhất theo vùng thành công')
  getTopByRegion(@Param('region') region: number) {
    return this.kqxsService.getTopByRegion(region);
  }

  @Get('special-mt')
  @ResponseMessage('Lấy kết quả đặc biệt miền Trung trong 7 ngày thành công')
  getAllSpecialMt() {
    return this.kqxsService.getAllSpecialMt();
  }

  @Get('special-mn')
  @ResponseMessage('Lấy kết quả đặc biệt miền Nam trong 7 ngày thành công')
  getAllSpecialMn() {
    return this.kqxsService.getAllSpecialMn();
  }

  @Get('special-mb')
  @ResponseMessage('Lấy kết quả đặc biệt miền Bắc trong 30 ngày thành công')
  getAllSpecialMb() {
    return this.kqxsService.getAllSpecialMb();
  }

  @Get('tan-suat')
  @ResponseMessage('Lấy kết quả tần suất xổ số thành công')
  getResultTanSuat(@Query() query: GetResultTanSuatDto) {
    return this.kqxsService.getResultTanSuat(query);
  }

  @Get('result-form-lo')
  @ResponseMessage('Lấy kết quả form lô thành công')
  getResultFormLo(@Query() query: GetResultFormLoDto) {
    return this.kqxsService.getResultFormLo(query);
  }
}
