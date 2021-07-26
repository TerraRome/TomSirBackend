const validate = require('validate.js');
const AddonMenu = require('../../../helpers/databases/mysql/model/AddonMenu');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findByCategoryId = async (payload) => {
  const ctx = 'findByCategoryId';
    try {
      let order = [[payload.sortBy,payload.order]];
      if(payload.sortBy != 'createdAt') {
        order = [[sequelize.fn('lower', sequelize.col(payload.sortBy)),payload.order]];
      }
      let query = {
        where: {
          addon_category_id: payload.addon_category_id
        },
        offset: (payload.page - 1) * payload.limit,
        limit: payload.limit,
        order: order,
        raw: true
      }
      const result = await AddonMenu.findAndCountAll(query);
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
      const result = await AddonMenu.findOne({
        where: {
          id: payload.id
        },
        raw: true
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'AddonMenu not found!', code: 404 },
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
      const result = await AddonMenu.create(payload);
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
      await AddonMenu.update(value, {
        where: {
          id: payload.id
        }
      });
      const result = await AddonMenu.findOne({
        where: {
          id: payload.id
        },
        raw: true
      });
      if(validate.isEmpty(result)) {
        console.log(ctx, result, 'isEmpty');
        return {
          err: { message: 'AddonMenu not found!', code: 404 },
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

const findMultpile = async (payload) => {
  const ctx = 'findMultpile';
    try {
      const result = await AddonMenu.findAll({
        where: {
          id: {
            [Op.in]: payload
          }
        }
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

const deleteOne = async (payload) => {
  const ctx = 'deleteOne';
    try {
      await AddonMenu.destroy({
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
  findByCategoryId,
  findMultpile,
  deleteOne
}