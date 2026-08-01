import tableService from '../services/table.service.js';

export const getAllTables = async (req, res, next) => {
  try {
    const tables = await tableService.getAllTables();
    res.status(200).json({ success: true, data: tables });
  } catch (err) { next(err); }
};

export const getTable = async (req, res, next) => {
  try {
    const table = await tableService.getTableById(req.params.id);
    res.status(200).json({ success: true, data: table });
  } catch (err) { next(err); }
};

export const updateTableStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const table = await tableService.updateTableStatus(req.params.id, status);
    res.status(200).json({ success: true, data: table });
  } catch (err) { next(err); }
};

export const createReservation = async (req, res, next) => {
  try {
    const reservation = await tableService.createReservation(req.body);
    res.status(201).json({ success: true, data: reservation });
  } catch (err) { next(err); }
};

export const getReservations = async (req, res, next) => {
  try {
    const { tableId, status } = req.query;
    const filters = {};
    if (tableId) filters.tableId = tableId;
    if (status) filters.status = status;
    const reservations = await tableService.getReservations(filters);
    res.status(200).json({ success: true, data: reservations });
  } catch (err) { next(err); }
};

export const createTable = async (req, res, next) => {
  try {
    const table = await tableService.createTable(req.body);
    res.status(201).json({ success: true, data: table });
  } catch (err) {
    next(err);
  }
};

export const checkTableAvailability = async (req, res, next) => {
  try {
    const { tableId, startTime, duration } = req.query;
    const available = await tableService.isTableAvailable(
      tableId,
      new Date(startTime),
      duration ? parseInt(duration) : 90
    );
    res.status(200).json({ success: true, available });
  } catch (err) { next(err); }
};
