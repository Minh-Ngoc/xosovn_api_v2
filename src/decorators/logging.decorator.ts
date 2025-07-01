import { ActionLogEnum, SubjectEnum } from '@/enums';
import { SetMetadata, applyDecorators } from '@nestjs/common';

export const Logging = (
  action_name: string,
  action: ActionLogEnum,
  subject: SubjectEnum,
  _params?: string[],
) => {
  return applyDecorators(
    SetMetadata('action_name', action_name),
    SetMetadata('action', action),
    SetMetadata('subject', subject),
    SetMetadata('_params', _params),
  );
};
