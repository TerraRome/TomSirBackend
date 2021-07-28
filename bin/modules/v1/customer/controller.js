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
  const checkUser = await model.findOne(payload);
  if (checkUser.err) {
    return checkUser;
  }

  if (checkUser.data.email != payload.email) {
    const result = await model.findByEmail(payload);
    if (result.err) {
      if (result.err.code != 404) {
        return result;
      }
    }
    if (!result.err) {
      return {
        err: { message: "email is already taken!", code: 409 },
        data: null,
      };
    }
  }

  const userObj = {
    email: payload.email,
    fullname: payload.fullname,
    role: payload.role,
    merchant_id: payload.merchant_id,
  };

  if (payload.password) {
    userObj.password = await common.generateHash(payload.password);
  }

  const update = await model.updateOne(userObj, payload);
  if (update.err) {
    return update;
  }

  return {
    err: null,
    data: update.data,
  };
};

module.exports = {
  getCustomers,
  create,
  update,
};
