const validate = require('validate.js');
const User = require('../../../helpers/databases/mysql/model/User');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findByEmail = async (payload) => {
  const ctx = 'findByEmail';
  try {
    const result = await User.findOne({
      where: {
        email: payload.email
      },
      include: ['merchant'],
      raw: true,
      nest: true
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'User not found!', code: 404 },
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

const updateOne = async (value, payload) => {
  const ctx = 'updateOne';
  try {
    await User.update(value, {
      where: {
        id: payload.id
      }
    });
    const result = await User.findOne({
      where: {
        id: payload.id
      },
      attributes: ['id', 'email', 'fullname', 'role', 'merchant_id', 'createdAt', 'updatedAt'],
      raw: true
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'User not found!', code: 404 },
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
      order = [[sequelize.fn('lower', sequelize.col(payload.sortBy)), payload.order]];
    }
    let query = {
      where: {
        role: {
          [Op.not]: 'superadmin'
        }
      },
      attributes: ['id', 'email', 'fullname', 'role', 'merchant_id', 'createdAt', 'updatedAt'],
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      order: order,
      include: ['merchant'],
      raw: true,
      nest: true
    }
    if (payload.search) {
      query.where = {
        ...query.where,
        [Op.or]: [{
          email: {
            [Op.like]: `%${payload.search}%`
          }
        }, {
          fullname: {
            [Op.like]: `%${payload.search}%`
          }
        }]
      };
    }
    if (payload.merchant_id) {
      query.where.merchant_id = payload.merchant_id;
    }
    const result = await User.findAndCountAll(query);
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
    const result = await User.findOne({
      where: {
        id: payload.id
      },
      include: ['merchant'],
      raw: true,
      nest: true
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'User not found!', code: 404 },
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
    const result = await User.create(payload);
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
    await User.destroy({
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
  findByEmail,
  updateOne,
  insertOne,
  findOne,
  findAll,
  deleteOne
}