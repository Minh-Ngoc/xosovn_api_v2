import { Controller } from '@nestjs/common';
import { ApiXosoService } from './api-xoso.service';

@Controller('api-xoso')
export class ApiXosoController {
  constructor(private readonly apiXosoService: ApiXosoService) {}
}
