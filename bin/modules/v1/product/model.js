const validate = require('validate.js');
const Product = require('../../../helpers/databases/mysql/model/Product');
const ProductAddon = require('../../../helpers/databases/mysql/model/ProductAddon');
const ProductIngredient = require('../../../helpers/databases/mysql/model/ProductIngredient');
const connSequelize = require('../../../helpers/databases/mysql/connection');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const findAll = async (payload) => {
  const ctx = 'findAll';
  try {
    let order = [[payload.sortBy, payload.order]];
    if (payload.sortBy != 'createdAt') {
      order = [[sequelize.fn('lower', sequelize.col(`tbl_product.${payload.sortBy}`)), payload.order]];
    }
    let query = {
      where: {
        merchant_id: payload.merchant_id
      },
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      order: order,
      include: [{
        association: 'category'
      }, {
        association: 'ingredient'
      }, {
        association: 'price_product'
      }, {
        association: 'addon_category',
        include: ['addon_menu']
      }],
      distinct: true
    }
    if (payload.search) {
      query.where = {
        ...query.where,
        [Op.or]: [{
          name: {
            [Op.like]: `%${payload.search}%`
          }
        }, {
          description: {
            [Op.like]: `%${payload.search}%`
          }
        }]
      };
    }
    if (payload.category_id) {
      query.where.category_id = payload.category_id;
    }
    console.log(query.where);
    const result = await Product.findAndCountAll(query);
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
    const result = await Product.findOne({
      where: {
        id: payload.id
      },
      include: [{
        association: 'category'
      }, {
        association: 'ingredient'
      }, {
        association: 'price_product'
      }, {
        association: 'addon_category',
        include: ['addon_menu']
      }]
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Product not found!', code: 404 },
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

const findBarcode = async (payload) => {
  const ctx = 'findBarcode';
  try {
    const result = await Product.findOne({
      where: {
        barcode: {
          [Op.like]: `%${payload.barcode}%`
        }
      },
      include: [{
        association: 'category'
      }, {
        association: 'ingredient'
      }, {
        association: 'price_product'
      }, {
        association: 'addon_category',
        include: ['addon_menu']
      }]
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, 'isEmpty');
      return {
        err: { message: 'Product not found!', code: 404 },
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
    await Product.create(payload);
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

const updateOne = async (value, payload) => {
  const ctx = 'updateOne';
  try {
    await Product.update(value, {
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

const insertAddon = async (payload) => {
  const ctx = 'insertAddon';
  try {
    const result = await ProductAddon.bulkCreate(payload);
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

const deleteAddon = async (payload) => {
  const ctx = 'deleteAddon';
  try {
    const result = await ProductAddon.destroy({
      where: {
        product_id: payload.product_id
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

const insertIngredient = async (payload) => {
  const ctx = 'insertIngredient';
  try {
    const result = await ProductIngredient.bulkCreate(payload);
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

const deleteIngredient = async (payload) => {
  const ctx = 'deleteIngredient';
  try {
    const result = await ProductIngredient.destroy({
      where: {
        product_id: payload.product_id
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

const findMultpileWithIngredient = async (payload) => {
  const ctx = 'findMultpileWithIngredient';
  try {
    const result = await Product.findAll({
      where: {
        id: {
          [Op.in]: payload
        }
      },
      include: ['ingredient']
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

const updateStock = async (payload) => {
  const ctx = 'updateStock';
  try {
    let ids = [];
    let caseSql = '';
    for (let i = 0; i < payload.length; i++) {
      caseSql += `WHEN '${payload[i].id}' THEN stock - ${payload[i].qty} `;
      ids.push(`'${payload[i].id}'`);
    }
    let querySql = `UPDATE tbl_product SET stock = (CASE id ${caseSql}END) WHERE id IN (${ids})`;
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
    let querySql = `UPDATE tbl_product SET stock = (CASE id ${caseSql}END) WHERE id IN (${ids})`;
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
    await Product.destroy({
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
  insertAddon,
  insertIngredient,
  findMultpileWithIngredient,
  updateStock,
  refundStock,
  deleteOne,
  deleteAddon,
  deleteIngredient,
  findBarcode
}