
import { Category, MenuItem } from '../models/index.js';
import { NotFoundError } from '../utils/errors.js';

class MenuService {
  // ---------- Categories ----------
  async getAllCategories() {
    return Category.findAll();
  }

  async createCategory(data) {
    return Category.create(data);
  }

  // ---------- Menu Items ----------
  async getAllItems(filters = {}) {
    const where = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.isAvailable !== undefined) where.isAvailable = filters.isAvailable;
    return MenuItem.findAll({ where, include: [Category] });
  }

  async getItemById(id) {
    const item = await MenuItem.findByPk(id, { include: [Category] });
    if (!item) throw new NotFoundError('Menu item');
    return item;
  }

  async createItem(data) {
    return MenuItem.create(data);
  }

  async updateItem(id, data) {
    const item = await MenuItem.findByPk(id);
    if (!item) throw new NotFoundError('Menu item');
    await item.update(data);
    return item;
  }

  async deleteItem(id) {
    const item = await MenuItem.findByPk(id);
    if (!item) throw new NotFoundError('Menu item');
    await item.destroy();
  }
}

export default new MenuService();
