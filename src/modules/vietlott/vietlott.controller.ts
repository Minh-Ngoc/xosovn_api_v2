import { Controller, Get, Param, Query } from '@nestjs/common';
import { VietlottService } from './vietlott.service';
import { GetVietlottByDate } from './dto/get-vietlott-by-date.dto';
import { ResponseMessage } from '@/decorators/response-message.decorator';
import { GetPaginationVietlottDto } from './dto/get-pagination-vietlott.dto';

@Controller('vietlott')
export class VietlottController {
  constructor(private readonly vietlottService: VietlottService) {}

  /*
    ================================================
    ========         Get Pagination         ========
    ================================================
  */
  @Get('power-655/pagination')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Power 6/55 thành công')
  getPaginationPower655(@Query() query: GetPaginationVietlottDto) {
    return this.vietlottService.getPaginationPower655(query);
  }

  @Get('mega-645/pagination')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Mega 6/45 thành công')
  getPaginationMega645(@Query() query: GetPaginationVietlottDto) {
    return this.vietlottService.getPaginationMega645(query);
  }

  @Get('max-3d/pagination')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Max 3D thành công')
  getPaginationMax3D(@Query() query: GetPaginationVietlottDto) {
    return this.vietlottService.getPaginationMax3D(query);
  }

  @Get('max-3d-pro/pagination')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Max 3D Pro thành công')
  getPaginationMax3DPro(@Query() query: GetPaginationVietlottDto) {
    return this.vietlottService.getPaginationMax3DPro(query);
  }

  /*
    ================================================
    ========         Get By Date            ========
    ================================================
  */
  @Get('power-655/:ngay')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Power 6/55 thành công')
  getPower655(@Param() date: GetVietlottByDate) {
    const { ngay } = date;

    return this.vietlottService.getPower655(ngay);
  }

  @Get('mega-645/:ngay')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Mega 6/45 thành công')
  getMega645(@Param() date: GetVietlottByDate) {
    const { ngay } = date;

    return this.vietlottService.getMega645(ngay);
  }

  @Get('max-3d/:ngay')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Max 3D thành công')
  getMax3D(@Param() date: GetVietlottByDate) {
    const { ngay } = date;

    return this.vietlottService.getMax3D(ngay);
  }

  @Get('max-3d-pro/:ngay')
  @ResponseMessage('Lấy kết quả xổ số Vietlott - Max 3D Pro thành công')
  getMax3DPro(@Param() date: GetVietlottByDate) {
    const { ngay } = date;

    return this.vietlottService.getMax3DPro(ngay);
  }
}
