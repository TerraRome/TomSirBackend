const validate = require('validate.js');
const Merchant = require('../../../helpers/databases/mysql/model/Merchant');
const connSequelize = require('../../../helpers/databases/mysql/connection');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findAll = async (payload) => {
  const ctx = 'findAll';
    try {
      let order = [[payload.sortBy,payload.order]];
      if(payload.sortBy != 'createdAt') {
        order = [[sequelize.fn('lower', sequelize.col(`tbl_merchant.${payload.sortBy}`)),payload.order]];
      }
      let query = {
        where: {},
        offset: (payload.page - 1) * payload.limit,
        limit: payload.limit,
        order: order
      }
      if(payload.search) {
        query.where = {
          [Op.or]: [{
            name: {
              [Op.like]: `%${payload.search}%`
            }
          }, {
            address: {
              [Op.like]: `%${payload.search}%`
            }
          }]
        };
      }
      const result = await Merchant.findAndCountAll(query);
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
      const result = await Merchant.findOne({
        where: {
          id: payload.id
        }
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'Merchant not found!', code: 404 },
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
      await Merchant.create(payload);
      const result = await Merchant.findOne({
        where: {
          id: payload.id
        },
        raw: true,
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

const updateOne = async (value, payload) => {
  const ctx = 'updateOne';
    try {
      await Merchant.update(value, {
        where: {
          id: payload.id
        }
      });
      const result = await Merchant.findOne({
        where: {
          id: payload.id
        },
        raw: true
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'Merchant not found!', code: 404 },
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
      await Merchant.destroy({
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
  deleteOne,
}