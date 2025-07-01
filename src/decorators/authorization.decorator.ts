import { AuthGuard } from '@/guards/auth.guard';
import { RolesGuard } from '@/guards/role.guard';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ActionEnum } from 'src/enums';

export function Authorization(subject?: string, action?: ActionEnum) {
  return applyDecorators(
    SetMetadata('subject', subject),
    SetMetadata('action', action),
    UseGuards(AuthGuard, RolesGuard),
  );
}
