import reportingService from "../services/reporting.service.js";

// ---------- Daily Sales ----------
export const getDailySales = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    // Ensure we only use date part
    const dateStr = targetDate.toISOString().split("T")[0];
    const record = await reportingService.getDailySales(dateStr);
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

// ---------- Stock Alerts ----------
export const getStockAlerts = async (req, res, next) => {
  try {
    const alerts = await reportingService.getStockAlerts();
    res.status(200).json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
};

export const resolveStockAlert = async (req, res, next) => {
  try {
    await reportingService.resolveStockAlert(req.params.id);
    res.status(200).json({ success: true, message: "Alert resolved" });
  } catch (err) {
    next(err);
  }
};

// ---------- Popular Items (optional) ----------
export const getPopularItems = async (req, res, next) => {
  try {
    // Not implemented yet – you can add logic in reportingService
    res.status(200).json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
};
