const Table = require('../models/Table');
const { sendSuccess, sendError } = require('../utils/helpers');

// GET /api/tables
const getAllTables = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const tables = await Table.find(filter).populate('currentOrder', 'orderNumber status totalAmount');
    sendSuccess(res, 200, 'Tables fetched.', { count: tables.length, tables });
  } catch (error) {
    next(error);
  }
};

// GET /api/tables/:id
const getTableById = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id).populate('currentOrder');
    if (!table) return sendError(res, 404, 'Table not found.');
    sendSuccess(res, 200, 'Table fetched.', { table });
  } catch (error) {
    next(error);
  }
};

// POST /api/tables
const createTable = async (req, res, next) => {
  try {
    const table = await Table.create(req.body);
    sendSuccess(res, 201, 'Table created.', { table });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tables/:id
const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!table) return sendError(res, 404, 'Table not found.');
    sendSuccess(res, 200, 'Table updated.', { table });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tables/:id
const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return sendError(res, 404, 'Table not found.');
    sendSuccess(res, 200, 'Table deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTables, getTableById, createTable, updateTable, deleteTable };
