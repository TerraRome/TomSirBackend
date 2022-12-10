const { v4: uuidv4 } = require('uuid');
const path = require('path');
const util = require('util');
const fs = require('fs');
const config = require('../../../configs/config');
const model = require('./model');

const getMerchant = async (payload) => {
  const result = await model.findOne(payload)
  if (result.err) {
    return result;
  }

  result.data.dataValues.image = result.data.dataValues.image ? config.baseUrl + result.data.dataValues.image : result.data.dataValues.image;
  return {
    err: null,
    data: result.data
  }
}

const getMerchants = async (payload) => {
  const result = await model.findAll(payload);
  if (result.err) {
    return result;
  }

  for (let i = 0; i < result.data.rows.length; i++) {
    if (result.data.rows[i].dataValues.image) {
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
    address: payload.address,
    phone_number: payload.phone_number,
    footer_note: payload.footer_note,
    // server_key: payload.server_key,
    // client_key: payload.client_key
  };

  if (payload.image) {
    const file = payload.image;
    const newFileName = insertObj.id + '-' + Date.now() + path.extname(file.name);
    const uploadPath = './public/images/merchant/' + newFileName;
    await util.promisify(file.mv)(uploadPath);
    insertObj.image = '/images/merchant/' + newFileName;
  }

  const insert = await model.insertOne(insertObj);
  if (insert.err) {
    if (payload.image) {
      fs.unlink(uploadPath, (err) => {
        if (err) console.log('error delete file => ', err);;
      });
    }
    return insert;
  }

  insert.data.image = insert.data.image ? config.baseUrl + insert.data.image : insert.data.image;
  return {
    err: null,
    data: insert.data
  }
}

const update = async (payload) => {
  const checkData = await model.findOne(payload)
  if (checkData.err) {
    return checkData;
  }

  const updateObj = {
    name: payload.name,
    address: payload.address,
    phone_number: payload.phone_number,
    footer_note: payload.footer_note,
    // server_key: payload.server_key,
    // client_key: payload.client_key
  };

  if (payload.image) {
    const file = payload.image;
    const newFileName = checkData.data.id + '-' + Date.now() + path.extname(file.name);
    const uploadPath = './public/images/merchant/' + newFileName;
    await util.promisify(file.mv)(uploadPath);
    updateObj.image = '/images/merchant/' + newFileName;
  }

  const update = await model.updateOne(updateObj, payload);
  if (update.err) {
    return update;
  }

  if (payload.image && checkData.data.image) {
    fs.unlink('./public/images/merchant/' + checkData.data.image.split('/').pop(), (err) => {
      if (err) console.log('error delete file => ', err);;
    });
  }

  update.data.image = update.data.image ? config.baseUrl + update.data.image : update.data.image;
  return {
    err: null,
    data: update.data
  }
}

const deleteOne = async (payload) => {
  const checkData = await model.findOne(payload)
  if (checkData.err) {
    return checkData;
  }

  const deleteOne = await model.deleteOne(payload);
  if (deleteOne.err) {
    return deleteOne;
  }

  if (checkData.data.image) {
    fs.unlink('./public/images/merchant/' + checkData.data.image.split('/').pop(), (err) => {
      if (err) console.log('error delete file => ', err);;
    });
  }

  return {
    err: null,
    data: deleteOne.data
  }
}

module.exports = {
  getMerchant,
  getMerchants,
  create,
  update,
  deleteOne
}