import reportingService from '../services/reporting.service.js';

export const getDailySales = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];
    const record = await reportingService.getDailySales(dateStr);
    res.status(200).json({ success: true, data: record });
  } catch (err) { next(err); }
};

export const getStockAlerts = async (req, res, next) => {
  try {
    const alerts = await reportingService.getStockAlerts();
    res.status(200).json({ success: true, data: alerts });
  } catch (err) { next(err); }
};

export const resolveStockAlert = async (req, res, next) => {
  try {
    await reportingService.resolveStockAlert(req.params.id);
    res.status(200).json({ success: true, message: 'Alert resolved' });
  } catch (err) { next(err); }
};

export const getPopularItems = async (req, res, next) => {
  try {
    // Not implemented yet
    res.status(200).json({ success: true, data: [] });
  } catch (err) { next(err); }
};
