import * as bcrypt from 'bcrypt';

export const roleDefault = [
  {
    _id: '659ba7c62b611171a5347a97',
    name: 'Supper Admin',
  },
  {
    _id: '66fb922a7970c059520cdbcd',
    name: 'Content',
  },
];
export const permissionDefault = [
  {
    _id: '65a0a995aa7ea10ac4d16961',
    role: '659ba7c62b611171a5347a97',
    action: ['manage'],
    subject: 'all',
  },
];
export const usersDefault = [
  {
    _id: '6604de8ae5068069a1bbb592',
    name: 'Super Admin',
    username: 'admin',
    password: '$2b$10$40vlq7LOwZxDVaJzgSOIEuvbW4Idso1qC7q1EH1bE3m8pVoQa6B5i',
    email: 'admin@gofiber.vn',
    role: '659ba7c62b611171a5347a97',
  },
  {
    name: 'Liên',
    email: 'lienntm@gofiber.vn',
    username: 'lienntm',
    password: bcrypt.hashSync('lienntm@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Trinh',
    email: 'kieutrinh@gofiber.vn',
    username: 'kieutrinh',
    password: bcrypt.hashSync('kieutrinh@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Kiều',
    email: 'kieugt@gofiber.vn',
    username: 'kieugt',
    password: bcrypt.hashSync('kieugt@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Lan',
    email: 'lanlth@gofiber.vn',
    username: 'lanlth',
    password: bcrypt.hashSync('lanlth@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Phước',
    email: 'phuocnn@gofiber.vn',
    username: 'phuocnn',
    password: bcrypt.hashSync('phuocnn@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Trân',
    email: 'tranndh@gofiber.vn',
    username: 'tranndh',
    password: bcrypt.hashSync('tranndh@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Vy',
    email: 'vynht@gofiber.vn',
    username: 'vynht',
    password: bcrypt.hashSync('vynht@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Thiên',
    email: 'thienntx@gofiber.vn',
    username: 'thienntx',
    password: bcrypt.hashSync('thienntx@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Ngân',
    email: 'nganhb@gofiber.vn',
    username: 'nganhb',
    password: bcrypt.hashSync('nganhb@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Thắng',
    email: 'thanglm@gofiber.vn',
    username: 'thanglm',
    password: bcrypt.hashSync('thanglm@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Nguyên',
    email: 'nguyenndp@gofiber.vn',
    username: 'nguyenndp',
    password: bcrypt.hashSync('nguyenndp@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Thảo',
    email: 'thaont@gofiber.vn',
    username: 'thaont',
    password: bcrypt.hashSync('thaont@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
  {
    name: 'Dung',
    email: 'dungntp@gofiber.vn',
    username: 'dungntp',
    password: bcrypt.hashSync('dungntp@123', 10),
    role: '66fb922a7970c059520cdbcd',
  },
];

export const adminRole = '659ba7c62b611171a5347a97';

export const FOLDER_UPLOAD_IMAGES = 'uploads/images';
