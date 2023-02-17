const { v4: uuidv4 } = require("uuid");
const model = require("./model");

const getTypeOrders = async (payload) => {
  const result = await model.findAll(payload);
  if (result.err) {
    return result;
  }

  result.data = {
    current_page: payload.page,
    page_size:
      result.data.rows.length < payload.limit
        ? result.data.rows.length
        : payload.limit,
    total_page: Math.ceil(result.data.count / payload.limit),
    ...result.data,
  };

  return {
    err: null,
    data: result.data,
  };
};

const getStatusTypeOrders = async (payload) => {
  const result = await model.findStatus(payload);
  if (result.err) {
    return result;
  }

  return {
    err: null,
    data: result.data,
  };
};

const create = async (payload) => {
  const result = await model.findOne(payload);
  if (result.err == null) {
    return {
      err: { message: "Type Order sudah ada", code: 404 },
      data: null,
    };
  }

  const insertObj = {
    id: uuidv4(),
    name: payload.name,
    price: payload.price,
    status: payload.status,
    merchant_id: payload.merchant_id,
  };

  const insert = await model.insertOne(insertObj);
  if (insert.err) {
    return insert;
  }

  return {
    err: null,
    data: insert.data,
  };
};

const update = async (payload) => {
  const result = await model.findOne(payload);
  if (result.data != null && result.data.id != payload.id) {
    return {
      err: { message: "Type Order sudah ada", code: 404 },
      data: null,
    };
  }

  const userObj = {
    name: payload.name,
    status: payload.status,
    price: payload.price,
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
  if (checkData.err) {
    return checkData;
  }

  const deleteOne = await model.deleteOne(payload);
  if (deleteOne.err) {
    return deleteOne;
  }

  return {
    err: null,
    data: deleteOne.data
  }
}

module.exports = {
  getTypeOrders,
  getStatusTypeOrders,
  create,
  update,
  deleteOne
};
