const { v4: uuidv4 } = require('uuid');
const path = require('path');
const util = require('util');
const fs = require('fs');
const config = require('../../../configs/config');
const model = require('./model');

const getProduct = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  result.data.dataValues.image = result.data.dataValues.image ? config.baseUrl + result.data.dataValues.image : result.data.dataValues.image;
  return {
    err: null,
    data: result.data
  }
}

const getBarcodeProduct = async (payload) => {
  const result = await model.findBarcode(payload)
  if(result.err) {
    return result;
  }

  result.data.dataValues.image = result.data.dataValues.image ? config.baseUrl + result.data.dataValues.image : result.data.dataValues.image;
  return {
    err: null,
    data: result.data
  }
}

const getProducts = async (payload) => {
  const result = await model.findAll(payload);
  if(result.err) {
    return result;
  }

  for (let i = 0; i < result.data.rows.length; i++) {
    if(result.data.rows[i].dataValues.image) {
      result.data.rows[i].dataValues.image = config.baseUrl + result.data.rows[i].dataValues.image;
    }
  }

  result.data = {
    current_page: payload.page,
    page_size: result.data.rows.length < payload.limit ? result.data.rows.length : payload.limit,
    total_page: Math.ceil(result.data.count / payload.limit),
    ...result.data
  }

  return {
    err: null,
    data: result.data
  }
}

const create = async (payload) => {
  const insertObj = {
    id: uuidv4(),
    name: payload.name,
    description: payload.description,
    stock: payload.stock,
    modal: payload.modal,
    price: payload.price,    
    sku: payload.sku,
    barcode: payload.barcode,
    sell_type: payload.sell_type,
    exp_date: payload.exp_date,
    category_id: payload.category_id,
    price_product_id: payload.price_product_id,
    merchant_id: payload.merchant_id,
    createdBy: payload.createdBy
  };

  if(payload.image) {
    const file = payload.image;
    const newFileName = insertObj.id + '-' + Date.now() + path.extname(file.name);
    const uploadPath = './public/images/product/' + newFileName;
    await util.promisify(file.mv)(uploadPath);
    insertObj.image = '/images/product/' + newFileName;
  }

  const insert = await model.insertOne(insertObj);
  if(insert.err) {
    if(payload.image) {
      fs.unlink(uploadPath, (err) => {
        if (err) console.log('error delete file => ', err);;
      });
    }
    return insert;
  }

  if(payload.addon_categories.length > 0) {
    let productAddonObj = [];
    for (let i = 0; i < payload.addon_categories.length; i++) {
      productAddonObj.push({
        id: uuidv4(),
        product_id: insertObj.id,
        addon_category_id: payload.addon_categories[i]
      })
    }
    await model.insertAddon(productAddonObj);
  }

  if(payload.ingredients.length > 0) {
    let productIngredientObj = [];
    for (let i = 0; i < payload.ingredients.length; i++) {
      productIngredientObj.push({
        id: uuidv4(),
        product_id: insertObj.id,
        ingredient_id: payload.ingredients[i].id,
        qty: payload.ingredients[i].qty
      })
    }
    await model.insertIngredient(productIngredientObj);
  }

  const result = await model.findOne({ id: insertObj.id })
  if(result.err) {
    return result;
  }

  result.data.dataValues.image = result.data.dataValues.image ? config.baseUrl + result.data.dataValues.image : result.data.dataValues.image;
  return {
    err: null,
    data: result.data
  }
}

const update = async (payload) => {
  const checkData = await model.findOne(payload)
  if(checkData.err) {
    return checkData;
  }

  const updateObj = {
    name: payload.name,
    description: payload.description,
    stock: payload.stock,
    modal: payload.modal,
    price: payload.price,
    sku: payload.sku,
    barcode: payload.barcode,
    sell_type: payload.sell_type,
    disc: payload.disc,
    is_disc_percentage: payload.is_disc_percentage,
    exp_date: payload.exp_date,
    category_id: payload.category_id,
    price_product_id: payload.price_product_id,
  };

  if(payload.image) {
    const file = payload.image;
    const newFileName = checkData.data.id + '-' + Date.now() + path.extname(file.name);
    const uploadPath = './public/images/product/' + newFileName;
    await util.promisify(file.mv)(uploadPath);
    updateObj.image = '/images/product/' + newFileName;
  }

  const update = await model.updateOne(updateObj, payload);
  if(update.err) {
    return update;
  }

  await model.deleteAddon({ product_id: payload.id });
  await model.deleteIngredient({ product_id: payload.id });

  if(payload.addon_categories.length > 0) {
    let productAddonObj = [];
    for (let i = 0; i < payload.addon_categories.length; i++) {
      productAddonObj.push({
        id: uuidv4(),
        product_id: payload.id,
        addon_category_id: payload.addon_categories[i]
      })
    }
    await model.insertAddon(productAddonObj);
  }

  if(payload.ingredients.length > 0) {
    let productIngredientObj = [];
    for (let i = 0; i < payload.ingredients.length; i++) {
      productIngredientObj.push({
        id: uuidv4(),
        product_id: payload.id,
        ingredient_id: payload.ingredients[i].id,
        qty: payload.ingredients[i].qty
      })
    }
    await model.insertIngredient(productIngredientObj);
  }

  if(payload.image && checkData.data.image) {
    fs.unlink('./public/images/product/'+checkData.data.image.split('/').pop(), (err) => {
      if (err) console.log('error delete file => ', err);;
    });
  }

  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  result.data.dataValues.image = result.data.dataValues.image ? config.baseUrl + result.data.dataValues.image : result.data.dataValues.image;
  return {
    err: null,
    data: result.data
  }
}

const deleteOne = async (payload) => {
  const checkData = await model.findOne(payload)
  if(checkData.err) {
    return checkData;
  }

  const deleteOne = await model.deleteOne(payload);
  if(deleteOne.err) {
    return deleteOne;
  }

  if(checkData.data.image) {
    fs.unlink('./public/images/product/'+checkData.data.image.split('/').pop(), (err) => {
      if (err) console.log('error delete file => ', err);;
    });
  }

  return {
    err: null,
    data: deleteOne.data
  }
}

module.exports = {
  getProduct,
  getProducts,
  create,
  update,
  deleteOne,
  getBarcodeProduct
}