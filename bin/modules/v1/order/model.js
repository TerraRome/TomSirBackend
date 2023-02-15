const validate = require('validate.js');
const Transaction = require('../../../helpers/databases/mysql/model/Transaction');
const TransactionProduct = require('../../../helpers/databases/mysql/model/TransactionProduct');
const Product = require('../../../helpers/databases/mysql/model/Product');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findAll = async (payload) => {
  const ctx = 'findAll';
  try {
    let order = [[payload.sortBy, payload.order]];
    if (payload.sortBy != 'createdAt') {
      order = [[sequelize.fn('lower', sequelize.col(payload.sortBy)), payload.order]];
    }
    let query = {
      where: {
        merchant_id: payload.merchant_id
      },
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      order: order,
      raw: true
    }
    if (payload.search) {
      query.where.code = {
        [Op.like]: `%${payload.search}%`
      };
    }
    if (payload.status) {
      query.where.status = payload.status;
    }
    if (payload.type) {
      query.where.type = payload.type;
    }
    if (payload.start_date && payload.end_date) {
      let start = new Date(payload.start_date);
      start.setHours(00);
      start.setMinutes(00);
      start.setSeconds(00);
      let end = new Date(payload.end_date);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      query.where.createdAt = {
        [Op.gte]: start,
        [Op.lte]: end
      };
    }
    const result = await Transaction.findAndCountAll(query);
    return {
      err: null,
      data: result
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const findOne = async (payload) => {
  const ctx = 'findOne';
  try {
    const result = await Transaction.findOne({
      where: {
        id: payload.id
      },
      include: [{
        association: 'transaction_product',
        include: [{
          association: 'product',
          include: [{
            association: 'ingredient'
          }, {
            association: 'addon_category',
            include: ['addon_menu']
          }]
        }]
      }]
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Transaction not found!', code: 404 },
        data: null
      }
    }
    return {
      err: null,
      data: result.toJSON()
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const findLastTransaction = async (payload) => {
  const ctx = 'findLastTransaction';
  try {
    const result = await Transaction.findOne({
      where: {
        merchant_id: payload.merchant_id,
        code: {
          [Op.like]: `${payload.code}%`
        }
      },
      order: [['createdAt', 'DESC']],
      raw: true
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Transaction not found!', code: 404 },
        data: null
      }
    }
    return {
      err: null,
      data: result
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const insertTransaction = async (payload) => {
  const ctx = 'insertTransaction';
  try {
    const result = await Transaction.create(payload);
    return {
      err: null,
      data: result
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const insertTransactionProduct = async (payload) => {
  const ctx = 'insertTransactionProduct';
  try {
    const result = await TransactionProduct.bulkCreate(payload);
    return {
      err: null,
      data: result
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const findTransactionProduct = async (payload) => {
  const ctx = 'findTransactionProduct';
  try {
    const result = await TransactionProduct.findOne({
      where: {
        id: payload.id
      },
      include: ['transaction', {
        association: 'product',
        include: ['ingredient']
      }]
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Transaction not found!', code: 404 },
        data: null
      }
    }
    return {
      err: null,
      data: result.toJSON()
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const findMultipleTransactionProduct = async (payload) => {
  const ctx = 'findMultipleTransactionProduct';
  try {
    const result = await TransactionProduct.findAll({
      where: {
        id: {
          [Op.in]: payload
        }
      },
      include: ['transaction', {
        association: 'product',
        include: ['ingredient']
      }]
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Transaction not found!', code: 404 },
        data: null
      }
    }
    return {
      err: null,
      data: result
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const updateTransaction = async (value, payload) => {
  const ctx = 'updateTransaction';
  try {
    await Transaction.update(value, {
      where: {
        id: payload.id
      }
    });
    return {
      err: null,
      data: ''
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const deleteTransaction = async (payload) => {
  const ctx = 'deleteTransaction';
  try {
    await Transaction.destroy({
      where: {
        id: payload.id
      }
    });
    return {
      err: null,
      data: ''
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const updateTransactionProduct = async (value, payload) => {
  const ctx = 'updateTransactionProduct';
  try {
    await TransactionProduct.update(value, {
      where: {
        id: payload.id
      }
    });
    return {
      err: null,
      data: ''
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const deleteTransactionProduct = async (payload) => {
  const ctx = 'deleteTransactionProduct';
  try {
    await TransactionProduct.destroy({
      where: {
        id: payload.id
      }
    });
    return {
      err: null,
      data: ''
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const deleteTransactionProductByTransactionId = async (payload) => {
  const ctx = 'deleteTransactionProductByTransactionId';
  try {
    await TransactionProduct.destroy({
      where: {
        transaction_id: payload.id
      }
    });
    return {
      err: null,
      data: ''
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const findAllWithDetail = async (payload) => {
  const ctx = 'findAllWithDetail';
  try {
    let query = {
      merchant_id: payload.merchant_id
    }
    if (payload.start_date && payload.end_date) {
      let start = new Date(payload.start_date);
      start.setHours(00);
      start.setMinutes(00);
      start.setSeconds(00);
      let end = new Date(payload.end_date);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      query.createdAt = {
        [Op.gte]: start,
        [Op.lte]: end
      };
    }
    const result = await Transaction.findAndCountAll({
      where: query,
      include: [{
        association: 'transaction_product',
        include: [{
          association: 'product',
          include: [{
            association: 'ingredient'
          }]
        }]
      }],
      order: [['createdAt', 'ASC']],
      distinct: true
    });
    return {
      err: null,
      data: result
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const findProductTransaction = async (payload) => {
  const ctx = 'findProductTransaction';
  try {
    let query = {
      merchant_id: payload.merchant_id
    }
    if (payload.search) {
      query.name = {
        [Op.like]: `%${payload.search}%`
      };
    }
    let queryTransaction = {};
    if (payload.start_date && payload.end_date) {
      let start = new Date(payload.start_date);
      start.setHours(00);
      start.setMinutes(00);
      start.setSeconds(00);
      let end = new Date(payload.end_date);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      queryTransaction.createdAt = {
        [Op.gte]: start,
        [Op.lte]: end
      };
    }
    const result = await Product.findAndCountAll({
      where: query,
      include: [{
        association: 'transaction_product',
        where: queryTransaction,
        required: true
      }, {
        association: 'ingredient'
      }],
      distinct: true
    });
    return {
      err: null,
      data: result
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

module.exports = {
  findAll,
  findOne,
  findLastTransaction,
  insertTransaction,
  insertTransactionProduct,
  findTransactionProduct,
  findMultipleTransactionProduct,
  updateTransaction,
  deleteTransaction,
  updateTransactionProduct,
  deleteTransactionProduct,
  deleteTransactionProductByTransactionId,
  findAllWithDetail,
  findProductTransaction
}