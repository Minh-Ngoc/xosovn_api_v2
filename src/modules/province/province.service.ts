import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Province, ProvinceDocument } from './province.entity';
import { Model } from 'mongoose';
import db_provinces from '@/mocks/db_provinces.json';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(Province.name, Province.name)
    private provinceModel: Model<ProvinceDocument>,
  ) {}

  private logger = new Logger(ProvinceService.name);

  async onModuleInit() {
    for (const province of db_provinces) {
      const isExisting = await this.provinceModel?.findById(province?._id);

      if (isExisting) continue;

      const created = await this.provinceModel?.create(province);

      this.logger.verbose(`Created new Province ${created?.name}`);
    }
  }

  find(query?: object) {
    return this.provinceModel.find(query || {});
  }

  findOne(query?: object) {
    return this.provinceModel.findOne(query || {});
  }

  findBySlug(slug: string) {
    return this.provinceModel.findOne({ nameNoSign: slug?.trim() });
  }

  getProvinceByDay(date: string) {
    const listProvince = [];

    if (date) {
      const dateParts = date.split('-');
      const dayOfWeek = new Date(
        +dateParts[2],
        Number(dateParts[1]) - 1,
        +dateParts[0],
      ).getDay();

      switch (dayOfWeek) {
        case 0: //sunday
          listProvince.push(1);
          listProvince.push(9); //Kom Tum
          listProvince.push(7); //Huế
          listProvince.push(8); //Khánh Hoà
          listProvince.push(32); //Tiền Giang
          listProvince.push(28); //Kiên Giang
          listProvince.push(37); //Đà Lạt
          break;

        case 1: //monday
          listProvince.push(1);
          listProvince.push(7); //Huế
          listProvince.push(11); //Phú Yên
          listProvince.push(26); //Đồng Tháp
          listProvince.push(33); //HCM
          listProvince.push(22); //Cà Mau
          break;

        case 2: //Tuesday
          listProvince.push(1);
          listProvince.push(4); //Đắk Lắk
          listProvince.push(13); //Quảng Nam
          listProvince.push(36); //Vũng Tàu
          listProvince.push(18); //Bến Tre
          listProvince.push(17); //Bạc Liêu
          break;

        case 3: //Wednesday
          listProvince.push(1);
          listProvince.push(8); //Khánh Hoà
          listProvince.push(3); //Đà Nẵng
          listProvince.push(23); //Cần thơ
          listProvince.push(30); //Sóc Trăng
          listProvince.push(25); //Đồng Nai
          break;

        case 4: //Thursday
          listProvince.push(1);
          listProvince.push(2); //Bình Định
          listProvince.push(12); //Quảng Bình
          listProvince.push(15); //Quảng Trị
          listProvince.push(16); //An Giang
          listProvince.push(31); //Tây Ninh
          listProvince.push(21); //Bình Thuận
          break;

        case 5: //Friday
          listProvince.push(1);
          listProvince.push(6); //Gia Lai
          listProvince.push(10); //Ninh Thuận
          listProvince.push(35); //Vĩnh Long
          listProvince.push(19); //Bình Dương
          listProvince.push(34); //Trà Vinh
          break;

        case 6: //Saturday
          listProvince.push(1);
          listProvince.push(14); //Quảng Ngãi
          listProvince.push(5); //Đắk Nông
          listProvince.push(3); //Đà Nẵng
          listProvince.push(29); //Long An
          listProvince.push(20); //Bình Phước
          listProvince.push(27); //Hậu Giang
          listProvince.push(33); //HCM
          break;

        default:
          break;
      }
    }

    return listProvince;
  }
}
