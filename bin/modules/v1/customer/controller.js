const { v4: uuidv4 } = require("uuid");
const model = require("./model");
const common = require("../../../helpers/common");
const config = require("../../../configs/config");

const getCustomers = async (payload) => {
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

const create = async (payload) => {
  const result = await model.findByPhone(payload);
  if (result.err) {
    if (result.err.code != 404) {
      return result;
    }

    const userObj = {
      id: uuidv4(),
      name: payload.name,
      email: payload.email,
      phone_number: payload.phone_number,
      merchant_id: payload.merchant_id,
    };

    const insert = await model.insertOne(userObj);
    if (insert.err) {
      return insert;
    }
    return insert;
  }

  return {
    err: { message: "phone number is already taken!", code: 409 },
    data: null,
  };
};

const update = async (payload) => {
  const result = await model.findIdAndPhone(payload);
  if (result.err.code == 409) {
    return {
      err: { message: "Phone Number is already taken!", code: 409 },
      data: null,
    };
  }

  const userObj = {
    name: payload.name,
    email: payload.email,
    phone_number: payload.phone_number,
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
  getCustomers,
  create,
  update,
  deleteOne
};
