import inventoryService from '../services/inventory.service.js';

export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await inventoryService.getAllIngredients();
    res.status(200).json({ success: true, data: ingredients });
  } catch (err) { next(err); }
};

export const updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await inventoryService.updateIngredient(req.params.id, req.body);
    res.status(200).json({ success: true, data: ingredient });
  } catch (err) { next(err); }
};

export const validateStock = async (req, res, next) => {
  try {
    const { items } = req.body;
    const result = await inventoryService.validateStock(items);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const createIngredient = async (req, res, next) => {
  try {
    const ingredient = await inventoryService.createIngredient(req.body);
    res.status(201).json({ success: true, data: ingredient });
  } catch (err) {
    next(err);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const recipe = await inventoryService.createRecipe(req.body);
    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    // Placeholder – implement if needed
    res.status(200).json({ success: true, data: [] });
  } catch (err) { next(err); }
};
