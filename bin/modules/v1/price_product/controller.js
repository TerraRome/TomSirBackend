const { v4: uuidv4 } = require("uuid");
const model = require("./model");

const getPrice = async (payload) => {
  const result = await model.findOne(payload);
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
      err: { message: "Price Product sudah ada", code: 404 },
      data: null,
    };
  }

  const insertObj = {
    id: uuidv4(),
    product_id: payload.product_id,
    price_info: payload.price_info,
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
  // const result = await model.findOne(payload);
  // if (result.data != null && result.data.id != payload.id) {
  //   return {
  //     err: { message: "Type Order sudah ada", code: 404 },
  //     data: null,
  //   };
  // }

  const userObj = {
    product_id: payload.product_id,
    price_info: payload.price_info,
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
  getPrice,
  create,
  update,
  deleteOne
};
