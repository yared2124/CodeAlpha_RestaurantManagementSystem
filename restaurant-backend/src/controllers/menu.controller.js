import menuService from "../services/menu.service.js";

// ---------- Category endpoints ----------
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await menuService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await menuService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// ---------- Menu Item endpoints ----------
export const getAllMenuItems = async (req, res, next) => {
  try {
    const { categoryId, isAvailable } = req.query;
    const items = await menuService.getAllItems({ categoryId, isAvailable });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const getMenuItem = async (req, res, next) => {
  try {
    const item = await menuService.getItemById(req.params.id);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const item = await menuService.createItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await menuService.updateItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    await menuService.deleteItem(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
