import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class RobotsService {
  private readonly robotsFile = 'robots.json'; // file json lưu robots
  private readonly folder = 'uploads/robots'; // file json lưu robots

  constructor(private readonly storageService: StorageService) {}

  getRobotsContent() {
    const content = this.storageService.readJson(this.folder, this.robotsFile);

    return { result: content || 'User-agent: *\nDisallow: /' };
  }

  updateRobotsContent(content: string) {
    if (!content) {
      throw new BadRequestException('Content Is Not Empty!');
    }

    this.storageService.saveJson(this.folder, this.robotsFile, content?.trim());

    return { success: true };
  }
}
