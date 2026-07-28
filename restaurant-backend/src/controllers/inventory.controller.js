import inventoryService from "../services/inventory.service.js";

// ---------- Ingredient CRUD ----------
export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await inventoryService.getAllIngredients();
    res.status(200).json({ success: true, data: ingredients });
  } catch (err) {
    next(err);
  }
};

export const updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await inventoryService.updateIngredient(
      req.params.id,
      req.body,
    );
    res.status(200).json({ success: true, data: ingredient });
  } catch (err) {
    next(err);
  }
};

// ---------- Stock validation ----------
export const validateStock = async (req, res, next) => {
  try {
    const { items } = req.body; // expects [{ menuItemId, quantity }]
    const result = await inventoryService.validateStock(items);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ---------- Transactions ----------
export const getTransactions = async (req, res, next) => {
  try {
    // You may want to add filtering, e.g., by ingredientId
    const { ingredientId } = req.query;
    // For simplicity, we'll just fetch all transactions (or implement pagination)
    // We need a method in inventoryService to fetch transactions.
    // For now, we'll return a placeholder.
    res.status(200).json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
};
