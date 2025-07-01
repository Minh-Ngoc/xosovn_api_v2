import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Menu, MenuDocument } from './menu.entity';
import { LexoRank } from 'lexorank';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private readonly menuModel: Model<MenuDocument>,
  ) {}

  async create(name: string, parentId?: string) {
    const siblings = await this.menuModel
      .find({ parent: parentId || null })
      .sort({ rank: 1 })
      .exec();

    const rank =
      siblings.length === 0
        ? LexoRank.middle().toString()
        : LexoRank.parse(siblings[siblings.length - 1].rank)
            .genNext()
            .toString();

    const path = parentId ? `${parentId}/${new Types.ObjectId()}` : '';

    const created = await this.menuModel.create({
      name,
      parent: parentId || null,
      rank,
      path,
    });

    return { menu: created };
  }

  async findAll() {
    const menus = await this.menuModel.find().sort({ rank: 1 }).exec();

    return { menus };
  }

  async findTree(parentId: string | null = null) {
    const items = await this.menuModel
      .find({ parent: parentId })
      .sort({ rank: 1 })
      .lean();

    const menus = await Promise.all(
      items.map(async (item) => ({
        ...item,
        children: await this.findTree(item._id.toString()),
      })),
    );

    return { menus };
  }

  async update(id: string, name: string) {
    const menu = await this.menuModel.findById(id);
    if (!menu) throw new NotFoundException('Menu not found');
    menu.name = name;
    await menu.save();

    return { menu };
  }

  async remove(id: string) {
    const children = await this.menuModel.find({ parent: id });
    if (children.length > 0) {
      throw new Error('Không thể xóa vì menu có con.');
    }
    await this.menuModel.findByIdAndDelete(id);

    return { success: true };
  }

  async move(id: string, newParentId: string | null, beforeId?: string) {
    const movingMenu = await this.menuModel.findById(id);
    if (!movingMenu) throw new NotFoundException('Menu không tồn tại');

    let newRank: string;

    const siblings = await this.menuModel
      .find({ parent: newParentId || null, _id: { $ne: id } })
      .sort({ rank: 1 })
      .exec();

    if (!beforeId) {
      // Đưa xuống cuối danh sách
      const last = siblings[siblings.length - 1];
      newRank = last
        ? LexoRank.parse(last.rank).genNext().toString()
        : LexoRank.middle().toString();
    } else {
      const index = siblings.findIndex((s) => s._id.toString() === beforeId);
      if (index === -1) throw new Error('Invalid beforeId');

      const prevRank =
        index > 0 ? LexoRank.parse(siblings[index - 1].rank) : null;
      const nextRank = LexoRank.parse(siblings[index].rank);

      newRank = prevRank
        ? prevRank.between(nextRank).toString()
        : LexoRank.parse('0|00000').between(nextRank).toString();
    }

    movingMenu.parent = new Types.ObjectId(newParentId);
    movingMenu.rank = newRank;
    await movingMenu.save();

    return { menu: movingMenu };
  }
}
