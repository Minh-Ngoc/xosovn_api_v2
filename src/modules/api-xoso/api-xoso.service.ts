import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { GetPaginationKqxsDto } from '../kqxs/dto/get-pagination-kqxs.dto';

@Injectable()
export class ApiXosoService {
  constructor(private readonly httpService: HttpService) {}

  private baseUrl = 'http://103.213.8.29:8110/api/v1/kqxs';

  async getPaginationXsmn(query: GetPaginationKqxsDto) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/mien-nam/pagination`, {
        params: query,
      }),
    ).then((res) => res.data);
  }

  async getPaginationXsmb(query: GetPaginationKqxsDto) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/mien-bac/pagination`, {
        params: query,
      }),
    ).then((res) => res.data);
  }

  async getPaginationXsmt(query: GetPaginationKqxsDto) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/mien-trung/pagination`, {
        params: query,
      }),
    ).then((res) => res.data);
  }

  async getPaginationTinh(query: GetPaginationKqxsDto) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/tinh/pagination`, {
        params: query,
      }),
    ).then((res) => res.data);
  }

  async getXSMN(ngay: string) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/mien-nam/${ngay}`),
    ).then((res) => res.data);
  }

  async getXSMB(ngay: string) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/mien-bac/${ngay}`),
    ).then((res) => res.data);
  }

  async getXSMT(ngay: string) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/mien-trung/${ngay}`),
    ).then((res) => res.data);
  }

  async getKqxsTinh(query: any) {
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}/tinh`, { params: query }),
    ).then((res) => res.data);
  }
}
