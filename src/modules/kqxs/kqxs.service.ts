import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Kqxs, KqxsDocument } from './kqxs.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProvinceService } from '../province/province.service';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { removeAccents } from '@/utils/remove-accents';
import { DoVeSoDto } from './dto/do-ve-so.dto';
import { GetStatisticDto } from './dto/get-statistic.dto';
import { GetResultTanSuatDto } from './dto/get-result-tan-suat.dto';
import moment from 'moment';
import { GetResultFormLoDto } from './dto/get-result-form-lo.dto';
import { GetResultFormGanDto } from './dto/get-result-form-gan.dto';
import { GetKqxsTinhDto } from './dto/get-kqxs-tinh.dto';
import { GetPaginationKqxsDto } from './dto/get-pagination-kqxs.dto';
import { ApiXosoService } from '../api-xoso/api-xoso.service';

@Injectable()
export class KqxsService {
  constructor(
    @InjectModel(Kqxs.name, Kqxs.name)
    private kqxsModel: Model<KqxsDocument>,

    private readonly provinceService: ProvinceService,

    private readonly apiService: ApiXosoService,
  ) {}

  private readonly logger = new Logger(KqxsService.name);

  // @Cron('5-45 16 * * *', {
  //   timeZone: 'Asia/Ho_Chi_Minh',
  // }) // từ 16:05 -> 16:45 mỗi ngày
  // async handleMienNam() {
  //   this.logger.verbose('🕓 Cron KQXS Miền Nam');
  //   await this.crawlDataMNV2(this.addingZeroToDate(new Date()));
  // }

  // @Cron('5-45 17 * * *', {
  //   timeZone: 'Asia/Ho_Chi_Minh',
  // }) // từ 17:05 -> 17:45 mỗi ngày
  // async handleMienTrung() {
  //   this.logger.verbose('🕔 Cron KQXS Miền Trung');
  //   await this.crawlDataMTV2(this.addingZeroToDate(new Date()));
  // }

  // @Cron('5-45 18 * * *', {
  //   timeZone: 'Asia/Ho_Chi_Minh',
  // }) // từ 18:05 -> 18:45 mỗi ngày
  // async handleMienBac() {
  //   this.logger.verbose('🕕 Cron KQXS Miền Bắc');
  //   await this.crawlDataMBV2(this.addingZeroToDate(new Date()));
  // }

  // createDatesList(params: GetPaginationKqxsDto) {
  //   const { date, limit, page } = params;
  //   const startDate = moment(date, 'DD-MM-YYYY');
  //   const dates: string[] = [];

  //   const startOffset = (page - 1) * limit;

  //   for (let i = 0; i < limit; i++) {
  //     const date = startDate.clone().subtract((startOffset + i) * 7, 'days');
  //     dates.push(date.format('DD-MM-YYYY'));
  //   }

  //   return dates;
  // }

  createSameWeekdays(params: GetPaginationKqxsDto) {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const weekdayNumber = moment(date, 'DD-MM-YYYY').isoWeekday();
    const validWeekdays = [weekdayNumber];
    const allDates: string[] = [];

    const current = startDate.clone();
    while (allDates.length < page * limit) {
      if (validWeekdays.includes(current.day())) {
        allDates.push(current.format('DD-MM-YYYY'));
      }
      current.subtract(1, 'day');
    }

    const start = (page - 1) * limit;
    return allDates.slice(start, start + limit);
  }

  createDatesList(params: GetPaginationKqxsDto) {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const dates: string[] = [];

    const startOffset = (page - 1) * limit;

    for (let i = 0; i < limit; i++) {
      const date = startDate.clone().subtract((startOffset + i) * 1, 'days');
      dates.push(date.format('DD-MM-YYYY'));
    }

    return dates;
  }

  // Thứ 4 và Thứ 7
  createWedSatDatesList(params: GetPaginationKqxsDto) {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const validWeekdays = [3, 6]; // Thứ Tư, Thứ Bảy

    const allDates: string[] = [];

    const current = startDate.clone();
    while (allDates.length < page * limit) {
      if (validWeekdays.includes(current.day())) {
        allDates.push(current.format('DD-MM-YYYY'));
      }
      current.subtract(1, 'day');
    }

    const start = (page - 1) * limit;
    return allDates.slice(start, start + limit);
  }

  // Thứ 4 và Chủ Nhật
  createWedSunDatesList(params: GetPaginationKqxsDto) {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const validWeekdays = [3, 0]; // Thứ Tư, Chủ Nhật

    const allDates: string[] = [];

    const current = startDate.clone();
    while (allDates.length < page * limit) {
      if (validWeekdays.includes(current.day())) {
        allDates.push(current.format('DD-MM-YYYY'));
      }
      current.subtract(1, 'day');
    }

    const start = (page - 1) * limit;
    return allDates.slice(start, start + limit);
  }

  // Thứ 2 và Thứ 7
  createMonSatDatesList(params: GetPaginationKqxsDto): string[] {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const validWeekdays = [1, 6]; // Thứ Hai, Thứ Bảy

    const allDates: string[] = [];

    const current = startDate.clone();
    while (allDates.length < page * limit) {
      if (validWeekdays.includes(current.day())) {
        allDates.push(current.format('DD-MM-YYYY'));
      }
      current.subtract(1, 'day');
    }

    const start = (page - 1) * limit;
    return allDates.slice(start, start + limit);
  }

  async saveDB(
    item,
    provinceId,
    date,
    prizeId,
    prizeColumn,
    region,
    code,
    isRunning = false,
  ) {
    const query = item.split('');
    const findOne = await this.kqxsModel
      .findOne({
        dayPrize: date,
        prizeId: prizeId,
        provinceId: provinceId,
        prizeColumn: prizeColumn,
        region: region,
      })
      .exec();

    if (findOne) {
      const result = await this.kqxsModel.findOneAndUpdate(
        {
          provinceId: provinceId,
          dayPrize: date,
          prizeColumn: prizeColumn,
          prizeId: prizeId,
          region: region,
        },
        {
          dayPrize: date,
          number: removeAccents(item),
          loto: query.slice(-2).toString().replace(/,/g, ''),
          firstNumber: query
            .slice(-2)
            .toString()
            .replace(/,/g, '')
            ?.split('')[0],
          lastNumber: query
            .slice(-2)
            .toString()
            .replace(/,/g, '')
            ?.split('')[1],
          thirdDigit: query[2] ? query[2] : '',
          fourthDigit: query[3] ? query[3] : '',
          fifthDigit: query[4] ? query[4] : '',
          sixthDigit: query[5] ? query[5] : '',
          provinceId: provinceId,
          prizeId: prizeId,
          prizeColumn: prizeColumn,
          region: region,
          isRunning: isRunning,
          code: code?.trim(),
        },
      );

      return result;
    }

    const payload: any = {};
    payload.dayPrize = date;
    payload.number = removeAccents(item);
    payload.loto = query.slice(-2).toString().replace(/,/g, '');
    payload.firstNumber = payload.loto.split('')[0];
    payload.lastNumber = payload.loto.split('')[1];
    payload.thirdDigit = query[2] ? query[2] : '';
    payload.fourthDigit = query[3] ? query[3] : '';
    payload.fifthDigit = query[4] ? query[4] : '';
    payload.sixthDigit = query[5] ? query[5] : '';
    payload.provinceId = provinceId;
    payload.prizeId = prizeId;
    payload.prizeColumn = prizeColumn;
    payload.region = region;
    payload.isRunning = String(isRunning);
    payload.code = code?.trim();

    const kqxs = await this.kqxsModel.create(payload);

    return kqxs;
  }

  reverseDate(date: string) {
    const dateArray = date.split('-');

    return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
  }

  getDay2Digits(date: Date) {
    const day = date.getDate();

    if (day < 10) {
      return '0' + day;
    }

    return day;
  }

  getMonth2Digits(date: Date) {
    // 👇️ Add 1, because getMonth is 0-11
    const month = date.getMonth() + 1;

    if (month < 10) {
      return '0' + month;
    }

    return month;
  }

  addingZeroToDate(MyDate: Date) {
    const MyDateString =
      this.getDay2Digits(MyDate) +
      '-' +
      this.getMonth2Digits(MyDate) +
      '-' +
      MyDate.getFullYear();

    return MyDateString;
  }

  extractPrizeText(el: any): {
    content: string;
    isRunning: boolean;
  } {
    const runLotoText = el.find('.runLoto').text();
    const content = runLotoText || el.text().trim();
    return {
      content,
      isRunning: !!runLotoText,
    };
  }

  async handlePrize(
    $: any,
    data: any,
    selector: string,
    prizeId: number,
    daiIds: string[],
    maTinhs: string[],
    groupColumn: number,
    date: string,
  ) {
    const prizeRows = data.find(selector);

    for (let daiIndex = 0; daiIndex < daiIds.length; daiIndex++) {
      const row = prizeRows.eq(daiIndex + 1);
      const prizeItems = row.find('div');

      for (let prizeIndex = 0; prizeIndex < prizeItems.length; prizeIndex++) {
        const el = prizeItems.eq(prizeIndex);
        const { content, isRunning } = this.extractPrizeText(el);

        if (!daiIds[daiIndex]) continue;

        await this.saveDB(
          isRunning ? '' : content,
          daiIds[daiIndex],
          date,
          prizeId,
          daiIndex * 3 + prizeIndex + 1,
          groupColumn,
          maTinhs[daiIndex],
          isRunning,
        );
      }
    }
  }

  /* Miền Nam */
  async crawlDataMNV2(date: string) {
    try {
      const getProvince = await this.provinceService.find().exec();
      let url = `https://www.minhngoc.net.vn/ket-qua-xo-so/mien-nam/${date}.html`;

      const isToday =
        date === this.addingZeroToDate(new Date()) &&
        new Date().getHours() === 16 &&
        new Date().getMinutes() >= 5 &&
        new Date().getMinutes() <= 45;

      if (isToday) {
        url = 'https://www.minhngoc.net.vn/xo-so-truc-tiep/mien-nam.html';
      }

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data = $('.box_kqxs').eq(0);

      let ngay_xo = data
        .find('.title')
        .find('a')
        .eq(1)
        .text()
        ?.replaceAll('/', '-');
      if (isToday) {
        ngay_xo = this.addingZeroToDate(new Date());
      }

      if (ngay_xo !== date) return;

      const listDai = data.find('.tinh');
      const daiNames = [0, 1, 2, 3]
        .map((i) => listDai.eq(i).text().trim())
        .filter(Boolean);
      const daiIds = daiNames.map(
        (name) => getProvince.find((p) => p.name === name)?._id,
      );
      const maTinhs = daiIds.map((_, i) => data.find('.matinh').eq(i).text());

      const prizeSelectors = [
        { selector: '.giai8', prizeId: 9 },
        { selector: '.giai7', prizeId: 8 },
        { selector: '.giai6', prizeId: 7 },
        { selector: '.giai5', prizeId: 6 },
        { selector: '.giai4', prizeId: 5 },
        { selector: '.giai3', prizeId: 4 },
        { selector: '.giai2', prizeId: 3 },
        { selector: '.giai1', prizeId: 2 },
        { selector: '.giaidb', prizeId: 1 },
      ];

      for (const { selector, prizeId } of prizeSelectors) {
        await this.handlePrize.call(
          this,
          $,
          data,
          selector,
          prizeId,
          daiIds,
          maTinhs,
          3,
          date,
        );
      }
    } catch (err) {
      console.error('❌ Error in crawlDataMNV2:', err);
    }
  }

  /* Miền Trung */
  async crawlDataMTV2(date: string) {
    try {
      const getProvince = await this.provinceService.find().exec();

      let url = `https://www.minhngoc.net.vn/ket-qua-xo-so/mien-trung/${date}.html`;
      const isToday =
        date === this.addingZeroToDate(new Date()) &&
        new Date().getHours() === 17 &&
        new Date().getMinutes() >= 5 &&
        new Date().getMinutes() <= 45;

      if (isToday) {
        url = 'https://www.minhngoc.net.vn/xo-so-truc-tiep/mien-trung.html';
      }

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data = $('.box_kqxs').eq(0);

      let ngay_xo = data
        .find('.title')
        .find('a')
        .eq(1)
        .text()
        ?.replaceAll('/', '-');
      if (isToday) {
        ngay_xo = this.addingZeroToDate(new Date());
      }

      if (ngay_xo !== date) return;

      const listDai = data.find('.tinh');

      const daiNames = [0, 1, 2]
        .map((i) => listDai.eq(i).text().trim())
        .filter(Boolean);

      const daiIds = daiNames.map(
        (name) => getProvince.find((p) => p.name === name)?._id,
      );

      const maTinhs = daiIds.map((_, i) => data.find('.matinh').eq(i).text());

      const prizeSelectors = [
        { selector: '.giai8', prizeId: 9 },
        { selector: '.giai7', prizeId: 8 },
        { selector: '.giai6', prizeId: 7 },
        { selector: '.giai5', prizeId: 6 },
        { selector: '.giai4', prizeId: 5 },
        { selector: '.giai3', prizeId: 4 },
        { selector: '.giai2', prizeId: 3 },
        { selector: '.giai1', prizeId: 2 },
        { selector: '.giaidb', prizeId: 1 },
      ];

      for (const { selector, prizeId } of prizeSelectors) {
        await this.handlePrize.call(
          this,
          $,
          data,
          selector,
          prizeId,
          daiIds,
          maTinhs,
          2,
          date,
        );
      }
    } catch (err) {
      console.error('❌ Error in crawlDataMTV2:', err);
    }
  }

  /* Miền Bắc */
  async crawlDataMBV2(date: string) {
    const ngayXo = date;
    const isLiveTime =
      new Date().getHours() === 18 &&
      new Date().getMinutes() >= 5 &&
      new Date().getMinutes() <= 45 &&
      ngayXo === this.addingZeroToDate(new Date());

    const url = isLiveTime
      ? 'https://www.minhngoc.net.vn/xo-so-truc-tiep/mien-bac.html'
      : `https://www.minhngoc.net.vn/ket-qua-xo-so/mien-bac/${ngayXo}.html`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const data = $('.box_kqxs').eq(0);

      let ngay_xo = data
        .find('.title')
        .find('a')
        .eq(1)
        .text()
        ?.replaceAll('/', '-');
      if (isLiveTime) {
        ngay_xo = this.addingZeroToDate(new Date());
      }

      if (ngay_xo !== date) return;

      const idDai = 1;
      const maTinh =
        data
          .find('.loai_ves')
          .eq(0)
          .text()
          .replace('Ký hiệu trúng Đặc Biệt:', '') ||
        data
          .find('.loai_ve')
          .eq(0)
          .text()
          .replace('Ký hiệu trúng Đặc Biệt:', '');

      const prizeMap = [
        { selector: '.giai7', prizeId: 8 },
        { selector: '.giai6', prizeId: 7 },
        { selector: '.giai5', prizeId: 6 },
        { selector: '.giai4', prizeId: 5 },
        { selector: '.giai3', prizeId: 4 },
        { selector: '.giai2', prizeId: 3 },
      ];

      for (const { selector, prizeId } of prizeMap) {
        const divs = data.find(selector).find('div');
        for (let index = 0; index < divs.length; index++) {
          const el = divs.eq(index);
          const value = el.text();
          const isRunning = !!el.find('.runLoto').text();
          await this.saveDB(
            isRunning ? '' : value,
            idDai,
            ngay_xo,
            prizeId,
            index + 1,
            1,
            maTinh,
            isRunning,
          );
        }
      }

      // Giai 1
      const g1 = data.find('.giai1');
      const g1IsRunning = !!g1.find('.runLoto').text();
      await this.saveDB(
        g1IsRunning ? '' : g1.text(),
        idDai,
        ngay_xo,
        2,
        2,
        1,
        maTinh,
        g1IsRunning,
      );

      // Giai DB
      const db = data.find('.giaidb');
      const dbIsRunning = !!db.find('.runLoto').text();
      await this.saveDB(
        dbIsRunning ? '' : db.text(),
        idDai,
        ngay_xo,
        1,
        1,
        1,
        maTinh,
        dbIsRunning,
      );

      return { isSuccessed: true };
    } catch (err) {
      console.error('❌ Error in crawlDataMBV2:', err.message);
    }
  }

  async getKQXS(date: string, region: number): Promise<any[]> {
    try {
      const provinceIds = this.provinceService.getProvinceByDay(date);
      const listProvinces = await this.provinceService
        .find({ region: region, _id: { $in: provinceIds } })
        .exec();

      const listResult = [];

      for (const el of listProvinces) {
        let checkKQ = await this.kqxsModel
          .find({
            provinceId: el._id,
            dayPrize: date,
            region: region,
          })
          .exec();

        // Nếu chưa có data, crawl và retry
        if (checkKQ.length === 0) {
          if (region === 3) await this.crawlDataMNV2(date);
          if (region === 2) await this.crawlDataMTV2(date);
          if (region === 1) await this.crawlDataMBV2(date);

          checkKQ = await this.kqxsModel
            .find({
              provinceId: el._id,
              dayPrize: date,
              region: region,
            })
            .exec();
        }

        if (checkKQ.length > 0) {
          const resKQXS = {
            provinceId: el._id,
            serialDB: {},
            listXSTT: checkKQ,
            resultHead: checkKQ.reduce((r, a) => {
              r[a.firstNumber] = r[a.firstNumber] || [];
              r[a.firstNumber].push({ loto: a.loto, prizeId: a.prizeId });
              return r;
            }, {}),
            resultEnd: checkKQ.reduce((r, a) => {
              r[a.lastNumber] = r[a.lastNumber] || [];
              r[a.lastNumber].push({ loto: a.loto, prizeId: a.prizeId });
              return r;
            }, {}),
          };
          listResult.push(resKQXS);
        }
      }

      return listResult;
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async getXSMN(today: string) {
    try {
      const { isSuccessed, resultObj } = await this.apiService.getXSMN(today);

      return { isSuccessed, resultObj };
    } catch (err) {
      console.log('err: ', err);
      throw err;
    }
  }

  async getXSMB(today: string) {
    try {
      const { isSuccessed, resultObj } = await this.apiService.getXSMB(today);

      return { isSuccessed, resultObj };
    } catch (err) {
      throw err;
    }
  }

  async getXSMT(today: string) {
    try {
      const { isSuccessed, resultObj } = await this.apiService.getXSMT(today);

      return { isSuccessed, resultObj };
    } catch (err) {
      throw err;
    }
  }

  async getKQXSTinh(date: string, provinceId: number) {
    try {
      const thisProvince = await this.provinceService.findOne({
        _id: provinceId,
      });

      if (!thisProvince) {
        throw new BadRequestException('Province Not Found!');
      }

      const kqxs = await this.kqxsModel
        .find({
          provinceId: provinceId,
          dayPrize: date,
          region: thisProvince?.region,
        })
        .exec();

      if (kqxs?.length) {
        const result = {
          provinceId,
          serialDB: {},
          listXSTT: kqxs,
          resultHead: kqxs.reduce((r, a) => {
            r[a.firstNumber] = r[a.firstNumber] || [];
            r[a.firstNumber].push({ loto: a.loto, prizeId: a.prizeId });
            return r;
          }, {}),
          resultEnd: kqxs.reduce((r, a) => {
            r[a.lastNumber] = r[a.lastNumber] || [];
            r[a.lastNumber].push({ loto: a.loto, prizeId: a.prizeId });
            return r;
          }, {}),
        };

        return { result };
      }

      const { result } = await this.apiService.getKqxsTinh({
        date,
        province: provinceId,
      });

      if (result?.length) {
        return { result };
      }

      return {
        isSuccessed: false,
        resultObj: [],
      };
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async getPaginationXsmn(query: GetPaginationKqxsDto) {
    try {
      const { result } = await this.apiService.getPaginationXsmn(query);

      return { result };
    } catch (error) {
      throw error;
    }
  }

  async getPaginationXsmt(query: GetPaginationKqxsDto) {
    try {
      const { result } = await this.apiService.getPaginationXsmt(query);

      return { result };
    } catch (error) {
      throw error;
    }
  }

  async getPaginationXsmb(query: GetPaginationKqxsDto) {
    try {
      const { result } = await this.apiService.getPaginationXsmb(query);

      return { result };
    } catch (error) {
      throw error;
    }
  }

  async getPaginationTinh(query: GetPaginationKqxsDto) {
    try {
      const { result } = await this.apiService.getPaginationTinh(query);

      return { result };
    } catch (error) {
      console.log('error: ', error);

      throw error;
    }
  }

  private findClosestDate(target: string, dates: string[]): string | null {
    const targetDate = new Date(this.reverseDate(target));
    let closest: string | null = null;
    let minDiff = Infinity;

    for (const d of dates) {
      const diff =
        targetDate.getTime() - new Date(this.reverseDate(d)).getTime();
      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        closest = d;
      }
    }

    return closest;
  }

  async getKqxsTinh(query: GetKqxsTinhDto) {
    const { province, date } = query;

    try {
      // const inputDate = date && date !== 'undefined' ? date : this.addingZeroToDate(new Date());
      const { result } = await this.getKQXSTinh(date, province);

      // Nếu có kết quả đúng ngày, trả về luôn
      if (result?.listXSTT?.length) {
        return { result };
      }

      return {
        result: {
          isSuccessed: false,
          resultObj: {},
          date,
        },
      };

      // Nếu không có, tìm ngày gần nhất có dữ liệu
      // const xsByProvince = await this.kqxsModel
      //   .find({ provinceId: province })
      //   .sort({ dayPrize: -1 }) // sắp xếp giảm dần để lấy ngày gần nhất nhanh hơn
      //   .exec();

      // if (!xsByProvince.length) {
      //   return { result: [] };
      // }

      // // Tìm ngày gần nhất nhỏ hơn hoặc bằng ngày yêu cầu
      // const closest = this.findClosestDate(
      //   inputDate,
      //   xsByProvince.map((x) => x.dayPrize),
      // );

      // if (!closest) {
      //   return { result: [] };
      // }

      // const { result: kqxs } = await this.getKQXSTinh(closest, province);

      // return { result: kqxs };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteOne(payload: { dayPrize: string; provinceId: string | number }) {
    try {
      const { dayPrize, provinceId } = payload;

      const findOne = await this.kqxsModel.findOne({
        dayPrize,
        provinceId,
      });

      if (!findOne) {
        return {
          success: false,
          message: 'Data Not Found!',
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await this.kqxsModel.deleteMany({
        dayPrize,
        provinceId,
      });

      return { success: true };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /*
  async recursiveCheck(
    number: string,
    date: string,
    province: number,
  ): Promise<any> {
    try {
      if (!number || number?.length < 2) return {};

      // Trường hợp giải phụ đặc biệt (5 số cuối trùng giải đặc biệt)
      if (number?.length === 6) {
        const last5Digits = number?.slice(-5);
        const first5Digits = number?.slice(0, 5);

        const subSpecialPrize = await this.kqxsModel
          .findOne({
            number: new RegExp(`${last5Digits}$`),
            dayPrize: date,
            provinceId: province,
          })
          .lean();

        if (subSpecialPrize) {
          return { ...subSpecialPrize, prizeId: 11 }; // 11 = giải phụ
        }

        const consolationPrize = await this.kqxsModel
          .findOne({
            number: new RegExp(`^${first5Digits}`),
            dayPrize: date,
            provinceId: province,
          })
          .lean();

        if (consolationPrize) {
          return { ...consolationPrize, prizeId: 10 }; // 10 = giải khuyến khích
        }
      }

      // Kiểm tra số hiện tại
      const found = await this.kqxsModel
        .findOne({
          number,
          dayPrize: date,
          provinceId: province,
        })
        .lean();

      if (found) return found;

      // Đệ quy: bỏ số đầu tiên và thử lại
      return await this.recursiveCheck(number.slice(1), date, province);
    } catch (error) {
      console.error('Error in recursiveCheck:', error);
      throw error;
    }
  }

  async checkKqxs(body: DoVeSoDto) {
    const { number, date, province } = body;

    if (!number || number?.length !== 6) {
      return { kqxs: {} };
    }

    try {
      const result = await this.recursiveCheck(number, date, province);

      return { kqxs: result || {} };
    } catch (error) {
      console.error('Error in checkKqxs:', error);
      throw error;
    }
  }
  */

  async checkKqxs(body: DoVeSoDto) {
    const { number, date, province } = body;

    if (!number || number.length !== 6) {
      return { kqxs: [] };
    }

    try {
      const prizeList = await this.kqxsModel
        .find({ dayPrize: date, provinceId: province })
        .lean();

      if (!prizeList || prizeList?.length === 0) {
        return { kqxs: [] };
      }

      const matchedPrizes = [];

      // 1. Giải đặc biệt (trùng 6 số)
      const exactMatch = prizeList?.filter((p) => p?.number === number);
      matchedPrizes.push(...exactMatch);

      // 2. Giải phụ đặc biệt + khuyến khích
      const specialPrize = prizeList?.find((p) => p?.prizeId === 1);
      if (specialPrize) {
        const specialNumber = specialPrize?.number;

        const last5Input = number?.slice(-5);
        const first5Input = number?.slice(0, 5);

        const last5Special = specialNumber?.slice(-5);
        const first5Special = specialNumber?.slice(0, 5);
        const last1Input = number?.slice(-1);
        const last1Special = specialNumber?.slice(-1);

        if (last5Input === last5Special) {
          matchedPrizes.push({ ...specialPrize, prizeId: 11 }); // phụ đặc biệt
        }

        if (first5Input === first5Special && last1Input !== last1Special) {
          matchedPrizes.push({ ...specialPrize, prizeId: 10 }); // khuyến khích
        }
      }

      // 3. So đuôi các giải còn lại (từ 1–8 hoặc theo dữ liệu)
      for (const prize of prizeList) {
        const prizeNumber = prize?.number;
        if (!prizeNumber || prizeNumber.length >= 6) continue;

        const inputEnd = number?.slice(-prizeNumber?.length);
        if (inputEnd === prizeNumber) {
          matchedPrizes.push(prize);
        }
      }

      return { kqxs: matchedPrizes };
    } catch (error) {
      console.error('Error in checkKqxs:', error);
      throw error;
    }
  }

  async getStatistic(dto: GetStatisticDto) {
    const arrayOfDate: string[] = [];
    const date = new Date(this.reverseDate(dto.lastDate));
    const numberOfDate = dto.numberOfDate?.match(/^[0-9]+$/)
      ? parseInt(dto.numberOfDate)
      : 10;
    const coupleOfNumber = dto.coupleOfNumber
      ? dto.coupleOfNumber.split(',')
      : null;
    const option = dto.option;

    for (let i = 1; i <= numberOfDate; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() - i);
      arrayOfDate.push(this.addingZeroToDate(day));
    }

    const baseQuery: any = {
      dayPrize: { $in: arrayOfDate },
      provinceId: 1,
    };
    if (option === 'db') {
      baseQuery.prizeId = 1;
    }

    const returnResult = [];

    if (coupleOfNumber) {
      baseQuery.loto = { $in: coupleOfNumber };
      const result = await this.kqxsModel.find(baseQuery);
      return { statistic: [result], arrayDate: arrayOfDate };
    }

    for (let i = 0; i <= 99; i++) {
      const loto = i < 10 ? `0${i}` : `${i}`;
      const query = { ...baseQuery, loto };
      const result = await this.kqxsModel.find(query);
      returnResult.push(result);
    }

    return { statistic: returnResult, arrayDate: arrayOfDate };
  }

  async getAllByHead(region = 1) {
    const arrayDate = Array.from({ length: 30 }, (_, i) =>
      this.addingZeroToDate(
        new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
      ),
    );

    const result = await this.kqxsModel.aggregate([
      {
        $match: {
          dayPrize: { $in: arrayDate },
          region,
        },
      },
      {
        $group: {
          _id: '$firstNumber',
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return { result };
  }

  async getTopByRegion(region = 1) {
    const arrayDate = Array.from({ length: 30 }, (_, i) =>
      this.addingZeroToDate(
        new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
      ),
    );

    const result = await this.kqxsModel.aggregate([
      {
        $match: {
          dayPrize: { $in: arrayDate },
          region,
          loto: { $ne: '' },
        },
      },
      {
        $group: {
          _id: '$loto',
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    return { result };
  }

  async getAllSpecialMt() {
    const arrayDate = Array.from({ length: 7 }, (_, i) =>
      this.addingZeroToDate(
        new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
      ),
    );

    const provinces = await this.provinceService.find({ region: 2 });
    const provinceIds = provinces.map((p) => p._id);

    const result = await this.kqxsModel.find({
      dayPrize: { $in: arrayDate },
      provinceId: { $in: provinceIds },
      prizeId: 1,
    });

    return { arrayDate, specialStatistic: result };
  }

  async getAllSpecialMn() {
    const arrayDate = Array.from({ length: 7 }, (_, i) =>
      this.addingZeroToDate(
        new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
      ),
    );

    const provinces = await this.provinceService.find({ region: 3 });
    const provinceIds = provinces.map((p) => p._id);

    const result = await this.kqxsModel.find({
      dayPrize: { $in: arrayDate },
      provinceId: { $in: provinceIds },
      prizeId: 1,
    });

    return { arrayDate, specialStatistic: result };
  }

  async getAllSpecialMb() {
    const arrayDate = Array.from({ length: 30 }, (_, i) =>
      this.addingZeroToDate(
        new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
      ),
    );

    const result = await this.kqxsModel.find({
      dayPrize: { $in: arrayDate },
      provinceId: 1, // miền Bắc cố định là id 1
      prizeId: 1,
    });

    return { arrayDate, specialStatistic: result };
  }

  async getResultTanSuat(query: GetResultTanSuatDto) {
    try {
      const region = query.region || 0;
      const province = query.province || 0;
      const numberOfDays = query.number || 0;
      const searchType = query.searchType;
      const sortBy = query.sortBy;

      const arrayDate = [];
      for (let i = 1; i <= numberOfDays; i++) {
        arrayDate.push(
          this.addingZeroToDate(new Date(Date.now() - i * 24 * 60 * 60 * 1000)),
        );
      }

      const searchQuery: any = {
        loto: { $ne: '' },
        dayPrize: { $in: arrayDate },
      };

      if (sortBy === 'region' && region) {
        searchQuery.region = region;
      } else if (sortBy === 'province' && province) {
        searchQuery.provinceId = province;
      }

      if (searchType === 'special') {
        searchQuery.prizeId = 1;
      }

      const topByRegion = await this.kqxsModel.aggregate([
        { $match: searchQuery },
        {
          $group: {
            _id: '$loto',
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]);

      const allByHead = await this.kqxsModel.aggregate([
        { $match: searchQuery },
        {
          $group: {
            _id: '$firstNumber',
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]);

      const allByTail = await this.kqxsModel.aggregate([
        { $match: searchQuery },
        {
          $group: {
            _id: '$lastNumber',
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]);

      return { topByRegion, allByHead, allByTail };
    } catch (error) {
      console.error('Error in getResultTanSuat:', error);
      throw error;
    }
  }

  async getResultFormLo(query: GetResultFormLoDto) {
    try {
      const sortBy = query.sortBy || 'province';
      const province = query.province;
      const region = query.region;
      const startDate = query.startDate;
      let endDate = query.endDate;
      const number = query.number;

      let searchQuery: any = {};
      const arrayDate: string[] = [];

      if (!endDate) {
        endDate = this.reverseDate(this.addingZeroToDate(new Date()));
      }
      if (startDate) {
        const diffDate = moment(endDate, 'DD-MM-YYYY').diff(
          moment(startDate, 'DD-MM-YYYY'),
          'days',
        );
        for (let i = 0; i <= diffDate; i++) {
          arrayDate.push(
            moment(
              new Date(
                new Date(startDate).setDate(new Date(startDate).getDate() + i),
              ),
            ).format('DD-MM-YYYY'),
          );
        }

        searchQuery = {
          ...searchQuery,
          dayPrize: { $in: arrayDate },
        };
      }

      if (number) {
        searchQuery = {
          ...searchQuery,
          number: { $regex: `.*${number}$` },
        };
      }

      if (sortBy === 'province' && province) {
        searchQuery = {
          ...searchQuery,
          provinceId: province,
        };
      } else if (sortBy === 'region' && region) {
        searchQuery = {
          ...searchQuery,
          region,
        };
      }

      const result = await this.kqxsModel.find(searchQuery);
      return { result };
    } catch (error) {
      // Tùy theo cách bạn xử lý lỗi
      console.log('error: ', error);
      throw error;
    }
  }

  async getResultFormGan(query: GetResultFormGanDto) {
    const { sortBy = 'province', province, region, number, searchType } = query;

    const searchQuery: Record<string, any> = {};

    if (searchType === 'headTail') {
      searchQuery.number = { $regex: `.*${number}$` };
    } else {
      searchQuery.number = number;
      searchQuery.prizeId = 1;
    }

    if (sortBy === 'province') {
      searchQuery.provinceId = Number(province);
    } else if (sortBy === 'region') {
      searchQuery.region = Number(region);
    }

    const result = await this.kqxsModel.find(searchQuery).exec();

    if (result.length > 0) {
      return { result: result[result.length - 1] };
    }

    return { result };
  }
}
