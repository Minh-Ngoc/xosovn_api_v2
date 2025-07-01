import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger, LoggerDocument } from './logger.entity';
import { UserDocument } from '../user/user.entity';
import { ActionLogEnum, SubjectEnum } from '@/enums';
@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(Logger.name)
    private readonly loggerModel: Model<LoggerDocument>,
  ) {}
  async saveLog({
    action_name,
    userIp,
    action,
    subject,
    user,
    endpoint,
    method,
    requestBody,
    userAgent,
    referer,
    message,
    oldData,
    newData,
  }: {
    action_name: string;
    userIp: string;
    action: ActionLogEnum;
    subject: SubjectEnum;
    user: UserDocument;
    endpoint: string;
    method: string;
    requestBody: any;
    userAgent: string;
    referer: string;
    message?: any;
    messageLog?: any;
    oldData?: any;
    newData?: any;
    path?: any;
  }) {
    try {
      await this.loggerModel.create({
        actionName: action_name,
        ip: userIp,
        action,
        subject,
        user: user?._id,
        endPoint: endpoint,
        method,
        body: Object.keys(requestBody).length
          ? JSON.stringify(requestBody)
          : '',
        message: message ?? '',
        referer,
        userAgent,
        oldData: oldData || '',
        newData: newData || '',
      });
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }
  private buildQuery({ search, startDate, endDate, subject, action }) {
    const query: any = {};

    if (search) {
      query['$or'] = [
        { actionName: { $regex: `.*${search}.*`, $options: 'i' } },
      ];
    }

    if (startDate && endDate) {
      query['createdAt'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (action) query['action'] = action;

    if (subject) query['subject'] = subject;

    return query;
  }
  async findAllPaginated(query: any) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;
    const search = query.search || '';
    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            {
              actionName: { $regex: `.*${search}.*`, $options: 'i' },
            },
            {
              action: { $regex: `.*${search}.*`, $options: 'i' },
            },
            {
              message: { $regex: `.*${search}.*`, $options: 'i' },
            },
          ],
        }
      : {};

    const [result, total] = await Promise.all([
      this.loggerModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort('-createdAt')
        .populate('user', {
          email: 1,
          username: 1,
        })
        .exec(),
      this.loggerModel.countDocuments(filter).exec(),
    ]);

    return {
      result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
