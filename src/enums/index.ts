export enum ActionEnum {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export enum SubjectEnum {
  ALL = 'all',
  LOG = 'log',
  ROLE = 'role',
  USER = 'user',
  MENU = 'menu',
  POST = 'post',
  TAXONOMY = 'taxonomy',
  SOCIAL = 'social',
  SITEMAP = 'sitemap',
  PAGE = 'page',
  SCHEMA = 'schema',
  ROBOT = 'robot',
  SOMO = 'so-mo',
}

export const actionMapping = {
  create: 'Tạo',
  read: 'Đọc',
  update: 'Cập nhật',
  delete: 'Xóa',
  manage: 'Toàn quyền',
};

export const subjectMapping = {
  all: 'Tất cả',
  user: 'Người dùng',
  role: 'Quyền hạn',
  log: 'Log',
};

export enum ActionLogEnum {
  ALL = 'all',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  REGISTER = 'register',
  CHANGE_PASSWORD = 'change_password',
  ASK_DEPOSIT = 'ask_deposit',
}
