const validate = require("validate.js");
const Customer = require("../../../helpers/databases/mysql/model/Customer");
const sequelize = require("sequelize");
const Op = sequelize.Op;

const findIdAndPhone = async (payload) => {
  const ctx = "findOne";
  try {
    const resultAll = await Customer.findAll({
      where: {
        phone_number: payload.phone_number,
      },
      raw: true,
    });
    const resultOne = await Customer.findOne({
      where: {
        id: payload.id,
        phone_number: payload.phone_number,
      },
      raw: true,
    });
    if (resultAll.length >= 1 && resultOne == null) {
      return {
        err: { message: "Phone Number is already taken!", code: 409 },
        data: null,
      };
    }
    return {
      err: { message: "Save!", code: 402 },
      data: resultOne,
    };
  } catch (error) {
    console.log(ctx, error, "Catch Error");
    return {
      err: { message: "Internal Server Error!", code: 500 },
      data: null,
    };
  }
};

const findByPhone = async (payload) => {
  const ctx = "findByPhone";
  try {
    const result = await Customer.findOne({
      where: {
        phone_number: payload.phone_number,
      },
      raw: true,
      nest: true,
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, "isEmpty");
      return {
        err: { message: "Customer Phone not found!", code: 404 },
        data: null,
      };
    }
    return {
      err: null,
      data: result,
    };
  } catch (error) {
    console.log(ctx, error, "Catch Error");
    return {
      err: { message: "Internal Server Error!", code: 500 },
      data: null,
    };
  }
};

const updateOne = async (value, payload) => {
  const ctx = "updateOne";
  try {
    await Customer.update(value, {
      where: {
        id: payload.id,
      },
    });
    return {
      err: null,
      data: "",
    };
  } catch (error) {
    console.log(ctx, error, "Catch Error");
    return {
      err: { message: "Internal Server Erroraa!", code: 500 },
      data: null,
    };
  }
};

const findAll = async (payload) => {
  const ctx = "findAll";
  try {
    let order = [[payload.sortBy, payload.order]];
    if (payload.sortBy != "createdAt") {
      order = [
        [sequelize.fn("lower", sequelize.col(payload.sortBy)), payload.order],
      ];
    }
    let query = {
      where: {
        merchant_id: payload.merchant_id,
      },
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      order: order,
      raw: true,
    };
    const result = await Customer.findAndCountAll(query);
    return {
      err: null,
      data: result,
    };
  } catch (error) {
    console.log(ctx, error, "Catch Error");
    return {
      err: { message: "Internal Server Error!", code: 500 },
      data: null,
    };
  }
};

const insertOne = async (payload) => {
  const ctx = "insertOne";
  try {
    const result = await Customer.create(payload);
    return {
      err: null,
      data: result,
    };
  } catch (error) {
    console.log(ctx, error, "Catch Error");
    return {
      err: { message: "Internal Server Error!", code: 500 },
      data: null,
    };
  }
};

module.exports = {
  findIdAndPhone,
  findByPhone,
  updateOne,
  insertOne,
  findAll,
};
