const validate = require('validate.js');
const TypeOrder = require('../../../helpers/databases/mysql/model/TypeOrder');
const connSequelize = require('../../../helpers/databases/mysql/connection');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findOne = async (payload) => {
  const ctx = 'findOne';
    try {
      const result = await TypeOrder.findOne({
        where: {
          name: payload.name
        },
        raw: true
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'Type Order not found!', code: 404 },
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

const findAll = async (payload) => {
  const ctx = 'findAll';
    try {
      let order = [[payload.sortBy,payload.order]];
      if(payload.sortBy != 'createdAt') {
        order = [[sequelize.fn('lower', sequelize.col(`tbl_type_order.${payload.sortBy}`)),payload.order]];
      }
      let query = {
        where: {
          merchant_id: payload.merchant_id
        },
        offset: (payload.page - 1) * payload.limit,
        limit: payload.limit,
        order: order,
        distinct: true
      }
      if(payload.search) {
        query.where = {
          [Op.or]: [{
            deskripsi: {
              [Op.like]: `%${payload.search}%`
            }
          }, {
            type: {
              [Op.like]: `%${payload.search}%`
            }
          }]
        };
      }
      const result = await TypeOrder.findAndCountAll(query);
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
      const result = await TypeOrder.create(payload);
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
      await TypeOrder.update(value, {
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
  findAll,
  insertOne,
  updateOne
}