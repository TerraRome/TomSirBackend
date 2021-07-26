const validate = require('validate.js');
const AddonCategory = require('../../../helpers/databases/mysql/model/AddonCategory');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findAll = async (payload) => {
  const ctx = 'findAll';
    try {
      let order = [[payload.sortBy,payload.order]];
      if(payload.sortBy != 'createdAt') {
        order = [[sequelize.fn('lower', sequelize.col(payload.sortBy)),payload.order]];
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
      const result = await AddonCategory.findAndCountAll(query);
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
      const result = await AddonCategory.findOne({
        where: {
          id: payload.id
        },
        raw: true
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'AddonCategory not found!', code: 404 },
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
      const result = await AddonCategory.create(payload);
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
      await AddonCategory.update(value, {
        where: {
          id: payload.id
        }
      });
      const result = await AddonCategory.findOne({
        where: {
          id: payload.id
        },
        raw: true
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'AddonCategory not found!', code: 404 },
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

const deleteOne = async (payload) => {
  const ctx = 'deleteOne';
    try {
      await AddonCategory.destroy({
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
  deleteOne
}