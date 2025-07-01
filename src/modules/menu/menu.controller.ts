import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';
import menuData from './mocks/menu.json'
import { ResponseMessage } from '@/decorators/response-message.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('by-browser')
  @ResponseMessage('success')
  async getMenusByBrowser() {
    return menuData
  }
}
