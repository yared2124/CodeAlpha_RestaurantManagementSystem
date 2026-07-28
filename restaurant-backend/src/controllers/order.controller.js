import orderService from "../services/order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      customerId: req.user.id, // from authentication middleware
    };
    const result = await orderService.createOrder(orderData);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const filters = { status: req.query.status };
    const orders = await orderService.getAllOrders(filters);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const order = await orderService.updateStatus(
      req.params.id,
      status,
      reason,
    );
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
