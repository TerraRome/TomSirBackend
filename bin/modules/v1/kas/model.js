const validate = require('validate.js');
const Kas = require('../../../helpers/databases/mysql/model/Kas');
const connSequelize = require('../../../helpers/databases/mysql/connection');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findOne = async (payload) => {
  const ctx = 'findOne';
  try {
    const result = await Kas.findOne({
      where: {
        tanggal: payload.tanggal
      },
      raw: true
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Kas not found!', code: 404 },
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

const findOneId = async (payload) => {
  const ctx = 'findOne';
  try {
    const result = await Kas.findOne({
      where: {
        id: payload.id
      }
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Kas not found!', code: 404 },
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
    let order = [[payload.sortBy, payload.order]];
    if (payload.sortBy != 'createdAt') {
      order = [[sequelize.fn('lower', sequelize.col(`tbl_kas.${payload.sortBy}`)), payload.order]];
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
    if (payload.search) {
      query.where = {
        ...query.where,
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
    const result = await Kas.findAndCountAll(query);
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
    const result = await Kas.create(payload);
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
    await Kas.update(value, {
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
    await Kas.destroy({
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
  findOneId,
  findAll,
  insertOne,
  updateOne,
  deleteOne
}