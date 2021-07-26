const { v4: uuidv4 } = require('uuid');
const model = require('./model');

const getAddonCategory = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  return {
    err: null,
    data: result.data
  }
}

const getAddonCategories = async (payload) => {
  const result = await model.findAll(payload);
  if(result.err) {
    return result;
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
    is_required: payload.is_required,
    max_limit: payload.max_limit,
    merchant_id: payload.merchant_id,
    createdBy: payload.createdBy
  };

  const insert = await model.insertOne(insertObj);
  if(insert.err) {
    return insert;
  }

  insert.data.dataValues.is_required = insert.data.dataValues.is_required ? 1 : 0;
  return {
    err: null,
    data: insert.data
  }
}

const update = async (payload) => {
  const checkData = await model.findOne(payload)
  if(checkData.err) {
    return checkData;
  }

  const updateObj = {
    name: payload.name,
    is_required: payload.is_required,
    max_limit: payload.max_limit
  };

  const update = await model.updateOne(updateObj, payload);
  if(update.err) {
    return update;
  }

  return {
    err: null,
    data: update.data
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

  return {
    err: null,
    data: deleteOne.data
  }
}

module.exports = {
  getAddonCategory,
  getAddonCategories,
  create,
  update,
  deleteOne
}