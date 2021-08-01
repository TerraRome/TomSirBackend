const { v4: uuidv4 } = require('uuid');
const model = require('./model');

const getRegistration = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
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
    deskripsi: payload.deskripsi
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

module.exports = {
  getRegistration,
  create
}