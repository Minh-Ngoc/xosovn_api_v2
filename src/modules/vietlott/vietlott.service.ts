import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Max3D, Max3DDocument } from './entities/max3d.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Max3DPro, Max3DProDocument } from './entities/max3d-pro.entity';
import { Mega645, Mega645Document } from './entities/mega-645.entity';
import { Power655, Power655Document } from './entities/power-655.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';
import moment from 'moment';
import * as cheerio from 'cheerio';
import { GetPaginationVietlottDto } from './dto/get-pagination-vietlott.dto';

@Injectable()
export class VietlottService {
  constructor(
    @InjectModel(Max3D.name, Max3D.name)
    private max3dModel: Model<Max3DDocument>,

    @InjectModel(Max3DPro.name, Max3DPro.name)
    private max3dProModel: Model<Max3DProDocument>,

    @InjectModel(Mega645.name, Mega645.name)
    private mega645Model: Model<Mega645Document>,

    @InjectModel(Power655.name, Power655.name)
    private power655Model: Model<Power655Document>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /*========        Thứ 3, 5, 7          ========*/
  createTueThuSatDatesList(params: GetPaginationVietlottDto): string[] {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const validWeekdays = [2, 4, 6]; // Thứ Ba, Thứ Năm, Thứ Bảy

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

  /*========        Thứ 4, 6, CN          ========*/
  createWedFriSunDatesList(params: GetPaginationVietlottDto): string[] {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const validWeekdays = [3, 5, 0]; // Thứ Tư, Thứ Sáu, Chủ Nhật

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

  /*========        Thứ 2, 4, 6, CN          ========*/
  createMonWedFriSunDatesList(params: GetPaginationVietlottDto): string[] {
    const { date, limit, page } = params;
    const startDate = moment(date, 'DD-MM-YYYY');
    const validWeekdays = [1, 3, 5]; // Thứ Hai, Thứ Tư, Thứ Sáu

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

  /*
    ================================================
    ========        Power 6/55              ========
    ========        Thứ 3, 5, 7             ========
    ================================================
  */

  async saveDBPower655(item: any) {
    try {
      const create = await this.power655Model.create(item);

      return create;
    } catch (error) {
      console.log(error);
    }
  }

  async crawlDataPower655(date: string) {
    const ngayXo = date;
    const url = `https://xskt.com.vn/xspower/ngay-${ngayXo}`;

    try {
      const response = await axios.get(url);
      const html = response?.data;
      const $ = cheerio.load(html);
      const title = $('.box-ketqua');
      const ky_mo_thuong = title.find('.kmt').text()?.trim();

      if (!ky_mo_thuong) return;

      const result = title
        .find('.result .megaresult')
        .eq(0)
        .text()
        .split(' ')
        .filter(Boolean);

      const jp2Number = title.find('.result .megaresult').eq(1).text().trim();
      const winPrice = title.find('.trunggiai');

      const item = {
        dayPrize: ngayXo,
        number1: result[0],
        number2: result[1],
        number3: result[2],
        number4: result[3],
        number5: result[4],
        number6: result[5],
        number7: jp2Number,
        jackpot1: winPrice.find('tr').eq(2).find('td').eq(3).text(),
        jackpot2: winPrice.find('tr').eq(3).find('td').eq(3).text(),
        match3: winPrice.find('tr').eq(4).find('td').eq(3).text(),
        match4: winPrice.find('tr').eq(5).find('td').eq(3).text(),
        match5: winPrice.find('tr').eq(6).find('td').eq(3).text(),
        jackpotWinner: winPrice.find('tr').eq(2).find('td').eq(2).text(),
        jackpot2Winner: winPrice.find('tr').eq(3).find('td').eq(2).text(),
        match3Winner: winPrice.find('tr').eq(4).find('td').eq(2).text(),
        match4Winner: winPrice.find('tr').eq(5).find('td').eq(2).text(),
        match5Winner: winPrice.find('tr').eq(6).find('td').eq(2).text(),
        idKy: ky_mo_thuong,
      };

      const getData = await this.saveDBPower655(item);

      return getData;
    } catch (error) {
      console.error(`Failed to crawl Power655 for ${date}:`, error);
    }
  }

  async getDataPower655(date: string) {
    const powerKey = `power655-${date}`;
    const dataPower = await this.cacheManager.get<string>(powerKey);

    if (dataPower) {
      return JSON.parse(dataPower);
    }

    const result = await this.power655Model.findOne({ dayPrize: date }).exec();
    await this.cacheManager.set(powerKey, JSON.stringify(result || {}), 1800); // TTL 30 phút

    return result;
  }

  async getPower655(today: string) {
    const result = await this.getDataPower655(today);

    if (result && Object.keys(result)?.length) {
      return {
        isSuccessed: true,
        resultObj: result,
      };
    }

    const data = await this.crawlDataPower655(today);

    if (data) {
      return {
        isSuccessed: true,
        resultObj: data || [],
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const retryResult = await this.getDataPower655(today);

    return {
      isSuccessed: !!retryResult,
      resultObj: retryResult || [],
    };
  }

  async getPaginationPower655(query: GetPaginationVietlottDto) {
    try {
      const dates = this.createTueThuSatDatesList(query);

      if (!dates?.length) {
        return {
          isSuccessed: false,
          resultObj: [],
        };
      }

      const result = await Promise.all(
        dates?.map(async (date) => {
          const response = await this.getPower655(date);

          return { ...response, date };
        }),
      );

      return { result };
    } catch (error) {
      throw error;
    }
  }

  /*
    ================================================
    ========           Mega 6/45            ========
    ========          Thứ 4, 6, CN          ========
    ================================================
  */

  async saveDBMega645(item: any) {
    if (item?.ket_qua !== '') {
      const query = item?.ket_qua?.split(' ');

      const existing = await this.mega645Model.findOne({
        dayPrize: item?.dayPrize,
        idKy: item?.ky_mo_thuong || item?.idKy,
      });

      if (existing) return existing;

      const create = await this.mega645Model.create({
        number1: query[0],
        number2: query[1],
        number3: query[2],
        number4: query[3],
        number5: query[4],
        number6: query[5],
        jackpot: item?.jackpot,
        jackpotWinner: item?.jackpotWinner,
        match5: item?.match5,
        match5Winner: item?.match5Winner,
        match4: item?.match4,
        match4Winner: item?.match4Winner,
        match3: item?.match3,
        match3Winner: item?.match3Winner,
        dayPrize: item?.dayPrize,
        idKy: item?.idKy,
      });

      return create;
    }
  }

  async crawlDataMega645(date: string) {
    const ngayXo = date;
    const url = `https://xskt.com.vn/ngay/${ngayXo}.html`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const title = $('.box-ketqua');

      const mega645 = title.find('.result');

      const ky_mo_thuong = mega645.find('tr').eq(12).text().split(': ')[1];
      const ket_qua = mega645.find('tr').eq(13).find('td').eq(1).text();
      const trunggiai = title.find('.trunggiai');

      const jackpot = trunggiai
        .find('tr')
        .eq(2)
        .find('td:last-child')
        .eq(0)
        .html();

      const jackpotWinner = trunggiai
        .find('tr')
        .eq(2)
        .find('td:nth-child(3) b')
        .eq(0)
        .html();

      const match5 = trunggiai
        .find('tr')
        .eq(3)
        .find('td:last-child')
        .eq(0)
        .html();

      const match5Winner = trunggiai
        .find('tr')
        .eq(3)
        .find('td:nth-child(3) b')
        .eq(0)
        .html();

      const match4 = trunggiai
        .find('tr')
        .eq(4)
        .find('td:last-child')
        .eq(0)
        .html();

      const match4Winner = trunggiai
        .find('tr')
        .eq(4)
        .find('td:nth-child(3) b')
        .eq(0)
        .html();

      const match3 = trunggiai
        .find('tr')
        .eq(5)
        .find('td:last-child')
        .eq(0)
        .html();

      const match3Winner = trunggiai
        .find('tr')
        .eq(5)
        .find('td:nth-child(3) b')
        .eq(0)
        .html();

      const dataResult = {
        ket_qua,
        jackpot,
        jackpotWinner,
        match5,
        match5Winner,
        match4,
        match4Winner,
        match3,
        match3Winner,
        dayPrize: date,
        idKy: ky_mo_thuong,
      };

      const getData = await this.saveDBMega645(dataResult);

      return getData;
    } catch (error) {
      console.error(`[Crawl Mega 6/45] Error:`, error);
    }
  }

  async getDataMega645(date: string) {
    const mega645Key = `mega645-${date}`;
    const dataMega645 = await this.cacheManager.get<string>(mega645Key);

    if (dataMega645) {
      return JSON.parse(dataMega645);
    }

    const result = await this.mega645Model.findOne({ dayPrize: date }).exec();
    await this.cacheManager.set(mega645Key, JSON.stringify(result || {}), 1800); // TTL 30 phút

    return result;
  }

  async getMega645(today: string) {
    const result = await this.getDataMega645(today);

    if (result && Object.keys(result)?.length) {
      return {
        isSuccessed: true,
        resultObj: result,
      };
    }

    const data = await this.crawlDataMega645(today);

    if (data) {
      return {
        isSuccessed: true,
        resultObj: data || [],
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const retryResult = await this.getDataMega645(today);

    return {
      isSuccessed: !!retryResult,
      resultObj: retryResult || [],
    };
  }

  async getPaginationMega645(query: GetPaginationVietlottDto) {
    try {
      const dates = this.createWedFriSunDatesList(query);

      if (!dates?.length) {
        return {
          isSuccessed: false,
          resultObj: [],
        };
      }

      const result = await Promise.all(
        dates?.map(async (date) => {
          const response = await this.getMega645(date);

          return { ...response, date };
        }),
      );

      return { result };
    } catch (error) {
      throw error;
    }
  }

  /*
    ================================================
    ========         Max 3D Pro             ========
    ========        Thứ 3, 5, 7             ========
    ================================================
  */
  async saveDBMax3dPro(item: any) {
    try {
      const create = await this.max3dProModel.create(item);

      return create;
    } catch (error) {
      console.log(error);
    }
  }

  async crawlDataMax3DPro(date: string) {
    const ngayXo = date;
    const url = `https://xskt.com.vn/xsmax3dpro/ngay-${ngayXo}`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response?.data);
      const title = $('.box-ketqua');
      const max3DPro = title.find('.max3d');
      const ky_mo_thuong = max3DPro
        .find('tr')
        .eq(0)
        .find('.kmt')
        .find('a')
        .text()
        .trim();

      if (!ky_mo_thuong) return false;

      const getTextArray = (
        rowIndex: number,
        tdIndex: number,
        bIndex: number = -1,
      ) => {
        const cell = max3DPro.find('tr').eq(rowIndex).find('td').eq(tdIndex);
        const text =
          bIndex >= 0 ? cell.find('b').eq(bIndex).text() : cell.text();
        return text.trim().split(' ');
      };

      const getText = (rowIndex: number, tdIndex: number) =>
        max3DPro.find('tr').eq(rowIndex).find('td').eq(tdIndex).text().trim();

      const item = {
        dayPrize: date,
        idKy: ky_mo_thuong,
        specialPrize1: getTextArray(1, 1)[0],
        specialPrize2: getTextArray(1, 1)[1],
        specialPrizeWinners: getText(1, 2),
        subSpecialPrize1: getTextArray(2, 1)[0],
        subSpecialPrize2: getTextArray(2, 1)[1],
        subSpecialPrizeWinners: getText(2, 2),

        firstPrize1: getTextArray(3, 1, 0)[0],
        firstPrize2: getTextArray(3, 1, 0)[1],
        firstPrize3: getTextArray(3, 1, 1)[0],
        firstPrize4: getTextArray(3, 1, 1)[1],
        firstPrizeWinners: getText(3, 2),

        secondPrize1: getTextArray(4, 1, 0)[0],
        secondPrize2: getTextArray(4, 1, 0)[1],
        secondPrize3: getTextArray(4, 1, 1)[0],
        secondPrize4: getTextArray(4, 1, 1)[1],
        secondPrize5: getTextArray(4, 1, 2)[0],
        secondPrize6: getTextArray(4, 1, 2)[1],
        secondPrizeWinners: getText(4, 2),

        thirdPrize1: getTextArray(5, 1, 0)[0],
        thirdPrize2: getTextArray(5, 1, 0)[1],
        thirdPrize3: getTextArray(5, 1, 1)[0],
        thirdPrize4: getTextArray(5, 1, 1)[1],
        thirdPrize5: getTextArray(5, 1, 2)[0],
        thirdPrize6: getTextArray(5, 1, 2)[1],
        thirdPrize7: getTextArray(5, 1, 3)[0],
        thirdPrize8: getTextArray(5, 1, 3)[1],

        thirdPrizeWinners: getText(5, 2),
        fourthPrizeWinners: getText(6, 2),
        fifthPrizeWinners: getText(7, 2),
        sixthPrizeWinners: getText(8, 2),
      };

      const getData = await this.saveDBMax3dPro(item);

      return getData;
    } catch (error) {
      console.error('Error crawling Max3DPro:', error);
    }
  }

  async getDataMax3DPro(date: string) {
    const max3dProKey = `max3dpro-${date}`;
    const dataMax3DPro = await this.cacheManager.get<string>(max3dProKey);

    if (dataMax3DPro && dataMax3DPro !== '{}') {
      return JSON.parse(dataMax3DPro);
    }

    const result = await this.max3dProModel.findOne({ dayPrize: date }).exec();
    await this.cacheManager.set(
      max3dProKey,
      JSON.stringify(result || {}),
      1800,
    ); // TTL 30 phút

    return result;
  }

  async getMax3DPro(today: string) {
    const result = await this.getDataMax3DPro(today);

    if (result && Object.keys(result)?.length) {
      return {
        isSuccessed: true,
        resultObj: result,
      };
    }

    const data = await this.crawlDataMax3DPro(today);

    if (data) {
      return {
        isSuccessed: true,
        resultObj: data || [],
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const retryResult = await this.getDataMax3DPro(today);

    return {
      isSuccessed: !!retryResult,
      resultObj: retryResult || [],
    };
  }

  async getPaginationMax3DPro(query: GetPaginationVietlottDto) {
    try {
      const dates = this.createTueThuSatDatesList(query);

      if (!dates?.length) {
        return {
          isSuccessed: false,
          resultObj: [],
        };
      }

      const result = await Promise.all(
        dates?.map(async (date) => {
          const response = await this.getMax3DPro(date);

          return { ...response, date };
        }),
      );

      return { result };
    } catch (error) {
      throw error;
    }
  }

  /*
    ================================================
    ========           Max 3D               ========
    ========         Thứ 2, 4, 6            ========
    ================================================
  */
  async saveDBMax3d(item: any) {
    if (item?.ket_qua !== '') {
      try {
        const result = await this.max3dModel.findOne({
          dayPrize: item?.dayPrize,
          idKy: item?.ky_mo_thuong,
        });

        if (!result) {
          const create = await this.max3dModel.create(item);

          return create;
        }

        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async crawlDataMax3D(date: string) {
    const ngayXo = date;
    const url = `https://xskt.com.vn/ngay/${ngayXo}.html`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const title = $('.box-ketqua');
      const checkMax3D = title.find('#max3d').attr('id');

      if (checkMax3D !== 'max3d') return false;

      const max3D = title.find('.max3d');
      const getText = (trIndex: number, tdIndex: number, bIndex: number) =>
        max3D
          .find('tr')
          .eq(trIndex)
          .find('td')
          .eq(tdIndex)
          .find('b')
          .eq(bIndex)
          .text();

      const parseSplit = (val: string) => val?.split(' ') || [];

      const [firstPrize1, firstPrize2] = parseSplit(getText(2, 1, 0));
      const [secondPrize1, secondPrize3] = parseSplit(getText(3, 1, 0));
      const [secondPrize2, secondPrize4] = parseSplit(getText(3, 1, 1));
      const [thirdPrize1, thirdPrize4] = parseSplit(getText(4, 1, 0));
      const [thirdPrize2, thirdPrize5] = parseSplit(getText(4, 1, 1));
      const [thirdPrize3, thirdPrize6] = parseSplit(getText(4, 1, 2));
      const [consolation1, consolation5] = parseSplit(getText(5, 1, 0));
      const [consolation2, consolation6] = parseSplit(getText(5, 1, 1));
      const [consolation3, consolation7] = parseSplit(getText(5, 1, 2));
      const [consolation4, consolation8] = parseSplit(getText(5, 1, 3));

      const getEm = (trIdx: number) =>
        max3D.find('tr').eq(trIdx).find('td').eq(0).find('em').text();
      const getPrize = (trIdx: number) =>
        max3D.find('tr').eq(trIdx).find('td').eq(0).find('span').eq(1).text();

      const data = {
        idKy: max3D.find('tr').eq(0).find('.kmt a').text(),
        dayPrize: date,
        firstPrize1,
        firstPrize2,
        secondPrize1,
        secondPrize2,
        secondPrize3,
        secondPrize4,
        thirdPrize1,
        thirdPrize2,
        thirdPrize3,
        thirdPrize4,
        thirdPrize5,
        thirdPrize6,
        resultsConsolation1: consolation1,
        resultsConsolation2: consolation2,
        resultsConsolation3: consolation3,
        resultsConsolation4: consolation4,
        resultsConsolation5: consolation5,
        resultsConsolation6: consolation6,
        resultsConsolation7: consolation7,
        resultsConsolation8: consolation8,
        firstTotalWinners: getEm(2),
        secondTotalWinners: getEm(3),
        thirdTotalWinners: getEm(4),
        consolationTotalWinners: getEm(5),
        win1StAmount: getPrize(2),
        win2StAmount: getPrize(3),
        win3StAmount: getPrize(4),
        winConsolationAmount: getPrize(5),
        ket_qua: `${firstPrize1} ${firstPrize2}`, // bạn nên lưu giá trị này nếu dùng để kiểm tra rỗng
      };

      const getData = await this.saveDBMax3d(data);

      return getData;
    } catch (error) {
      console.error(`[Crawl Max3D] Error:`, error);
    }
  }

  async getDataMax3D(date: string) {
    const max3dKey = `max3d-${date}`;
    const dataMax3D = await this.cacheManager.get<string>(max3dKey);

    if (dataMax3D && dataMax3D !== '{}') {
      return JSON.parse(dataMax3D);
    }

    const result = await this.max3dModel.findOne({ dayPrize: date }).exec();

    await this.cacheManager.set(max3dKey, JSON.stringify(result || {}), 1800); // TTL 30 phút

    return result;
  }

  async getMax3D(today: string) {
    const result = await this.getDataMax3D(today);

    if (result && Object.keys(result)?.length) {
      return {
        isSuccessed: true,
        resultObj: result,
      };
    }

    const data = await this.crawlDataMax3D(today);

    if (data) {
      return {
        isSuccessed: true,
        resultObj: data,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    const retryResult = await this.getDataMax3D(today);

    return {
      isSuccessed: !!retryResult,
      resultObj: retryResult || [],
    };
  }

  async getPaginationMax3D(query: GetPaginationVietlottDto) {
    try {
      const dates = this.createMonWedFriSunDatesList(query);

      if (!dates?.length) {
        return {
          isSuccessed: false,
          resultObj: [],
        };
      }

      const result = await Promise.all(
        dates?.map(async (date) => {
          const response = await this.getMax3D(date);

          return { ...response, date };
        }),
      );

      return { result };
    } catch (error) {
      throw error;
    }
  }
}
