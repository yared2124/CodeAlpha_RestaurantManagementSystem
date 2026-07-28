import adminService from "../services/admin.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const metrics = await adminService.getDashboardData();
    res.status(200).json({ success: true, data: metrics });
  } catch (err) {
    next(err);
  }
};

