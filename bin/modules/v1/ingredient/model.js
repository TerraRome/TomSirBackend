const validate = require('validate.js');
const Ingredient = require('../../../helpers/databases/mysql/model/Ingredient');
const connSequelize = require('../../../helpers/databases/mysql/connection');
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
    const result = await Ingredient.findAndCountAll(query);
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
    const result = await Ingredient.findOne({
      where: {
        id: payload.id
      },
      raw: true
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Ingredient not found!', code: 404 },
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

const insertOne = async (payload) => {
  const ctx = 'insertOne';
  try {
    const result = await Ingredient.create(payload);
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

const updateOne = async (value, payload) => {
  const ctx = 'updateOne';
  try {
    await Ingredient.update(value, {
      where: {
        id: payload.id
      }
    });
    const result = await Ingredient.findOne({
      where: {
        id: payload.id
      },
      raw: true
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Ingredient not found!', code: 404 },
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

const updateStock = async (payload) => {
  const ctx = 'updateStock';
  try {
    let ids = [];
    let caseSql = '';
    for (let i = 0; i < payload.length; i++) {
      caseSql += `WHEN '${payload[i].id}' THEN stock - ${payload[i].qty} `;
      ids.push(`'${payload[i].id}'`);
    }
    let querySql = `UPDATE tbl_ingredient SET stock = (CASE id ${caseSql}END) WHERE id IN (${ids})`;
    await connSequelize.query(querySql);
    return {
      err: null,
      data: 'success'
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const refundStock = async (payload) => {
  const ctx = 'refundStock';
  try {
    let ids = [];
    let caseSql = '';
    for (let i = 0; i < payload.length; i++) {
      caseSql += `WHEN '${payload[i].id}' THEN stock - ${payload[i].qty} `;
      ids.push(`'${payload[i].id}'`);
    }
    let querySql = `UPDATE tbl_ingredient SET stock = (CASE id ${caseSql}END) WHERE id IN (${ids})`;
    await connSequelize.query(querySql);
    return {
      err: null,
      data: 'success'
    }
  } catch (error) {
    console.log(ctx, error, 'Catch Error');
    return {
      err: { message: 'Internal Server Error!', code: 500 },
      data: null
    }
  }
}

const deleteOne = async (payload) => {
  const ctx = 'deleteOne';
  try {
    await Ingredient.destroy({
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

module.exports = {
  findOne,
  updateOne,
  insertOne,
  findAll,
  updateStock,
  refundStock,
  deleteOne
}