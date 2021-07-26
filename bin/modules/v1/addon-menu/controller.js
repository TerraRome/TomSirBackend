const { v4: uuidv4 } = require('uuid');
const model = require('./model');

const getAddonMenu = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  return {
    err: null,
    data: result.data
  }
}

const getAddonMenusByCategoryId = async (payload) => {
  const result = await model.findByCategoryId(payload);
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
    is_active: payload.is_active,
    price: payload.price,
    addon_category_id: payload.addon_category_id,
    createdBy: payload.createdBy
  };

  const insert = await model.insertOne(insertObj);
  if(insert.err) {
    return insert;
  }

  insert.data.dataValues.is_active = insert.data.dataValues.is_active ? 1 : 0;
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
    is_active: payload.is_active,
    price: payload.price
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
  getAddonMenu,
  getAddonMenusByCategoryId,
  create,
  update,
  deleteOne
}