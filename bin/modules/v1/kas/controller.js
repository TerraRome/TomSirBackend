const { v4: uuidv4 } = require('uuid');
const model = require('./model');

const getAllKas = async (payload) => {
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
    tanggal: payload.tanggal,
    type: payload.type,
    jumlah: payload.jumlah,
    deskripsi: payload.deskripsi,
    merchant_id: payload.merchant_id
  };

  const insert = await model.insertOne(insertObj);
  if(insert.err) {
    return insert;
  }

  return {
    err: null,
    data: insert.data
  }
}

const update = async (payload) => {
  const userObj = {
    tanggal: payload.tanggal,
    type: payload.type,
    jumlah: payload.jumlah,
    deskripsi: payload.deskripsi,
    merchant_id: payload.merchant_id,
  };

  const update = await model.updateOne(userObj, payload);
  if (update.err) {
    return update;
  }

  return {
    err: null,
    data: update.data,
  };
};

const deleteOne = async (payload) => {
  const checkData = await model.findOneId(payload)
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
  getAllKas,
  create,
  update,
  deleteOne
}