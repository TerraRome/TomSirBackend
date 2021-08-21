const validate = require('validate.js');
const PriceProduct = require('../../../helpers/databases/mysql/model/PriceProduct');
const connSequelize = require('../../../helpers/databases/mysql/connection');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findOne = async (payload) => {
  const ctx = 'findOne';
    try {
      let query = {}
      if(payload.id) {
        query.where = {
          [Op.or]: [{
            id: {
              [Op.like]: `%${payload.id}%`
            }
          }]
        };
      }
      if(payload.product_id) {
        query.where = {
          [Op.or]: [{
            product_id: {
              [Op.like]: `%${payload.product_id}%`
            }
          }]
        };
      }
      const result = await PriceProduct.findOne(query);
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
      let query = {
        where: {
          product_id: payload.product_id
        },
      }
      const result = await PriceProduct.findAll(query);
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
      const result = await PriceProduct.create(payload);
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
      await PriceProduct.update(value, {
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

const deleteOne = async (payload) => {
  const ctx = 'deleteOne';
    try {
      await PriceProduct.destroy({
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
  updateOne,
  deleteOne
}