const validate = require('validate.js');
const Registration = require('../../../helpers/databases/mysql/model/Registration');
const connSequelize = require('../../../helpers/databases/mysql/connection');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findOne = async (payload) => {
  const ctx = 'findOne';
    try {
      const result = await Registration.findOne({
        where: {
          tanggal: payload.tanggal
        },
        raw: true
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'Registration not found!', code: 220 },
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
      if(payload.start_date && payload.end_date) {
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
      const result = await Registration.findAndCountAll(query);
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
      const result = await Registration.create(payload);
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
  findOne,
  findAll,
  insertOne
}