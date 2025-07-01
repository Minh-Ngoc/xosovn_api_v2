import { SetMetadata } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

// Định nghĩa một hằng số khóa để truy xuất metadata của decorator
export const RESPONSE_MESSAGE_KEY = 'RESPONSE_MESSAGE';

// Tạo decorator HttpResponse chỉ nhận tham số message
export const ResponseMessage = (message: string, statusCode?: HttpStatusCode) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, { statusCode, message });
