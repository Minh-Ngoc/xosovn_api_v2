import { AuthGuard } from '@/guards/auth.guard';
import { UseGuards, applyDecorators } from '@nestjs/common';

export function Authentication() {
  return applyDecorators(UseGuards(AuthGuard));
}
