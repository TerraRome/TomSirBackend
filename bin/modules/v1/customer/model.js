const validate = require("validate.js");
const Customer = require("../../../helpers/databases/mysql/model/Customer");
const sequelize = require("sequelize");
const Op = sequelize.Op;

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
        err: { message: "Customer not found!", code: 404 },
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
    const result = await Customer.findOne({
      where: {
        id: payload.id,
      },
      attributes: [
        "id",
        "email",
        "fullname",
        "role",
        "merchant_id",
        "createdAt",
        "updatedAt",
      ],
      raw: true,
    });
    if (validate.isEmpty(result)) {
      console.log(ctx, result, "isEmpty");
      return {
        err: { message: "Customer not found!", code: 404 },
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
        role: {
          [Op.not]: "superadmin",
        },
      },
      attributes: [
        "id",
        "email",
        "fullname",
        "role",
        "merchant_id",
        "createdAt",
        "updatedAt",
      ],
      offset: (payload.page - 1) * payload.limit,
      limit: payload.limit,
      order: order,
      include: ["merchant"],
      raw: true,
      nest: true,
    };
    if (payload.search) {
      query.where = {
        [Op.or]: [
          {
            email: {
              [Op.like]: `%${payload.search}%`,
            },
          },
          {
            fullname: {
              [Op.like]: `%${payload.search}%`,
            },
          },
        ],
      };
    }
    if (payload.merchant_id) {
      query.where.merchant_id = payload.merchant_id;
    }
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
  findByPhone,
  updateOne,
  insertOne,
  findAll,
};
