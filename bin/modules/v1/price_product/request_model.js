const joi = require('joi');

const getPrice = joi.object({
  id: joi.string().optional().allow('').default(''),
  product_id: joi.string().optional().allow('').default(''),
});

const getPrices = joi.object({
  product_id: joi.string().required()
});

const create = joi.object({
  product_id: joi.string().required(),
  price_info: joi.string().required(),
  // merchant_id: joi.string().required().messages({
  //   'any.required': `Akun anda tidak memiliki merchant`
  // }),
});

const update = joi.object({
  id: joi.string().required(),
  product_id: joi.string().required(),
  price_info: joi.string().required(),
});

module.exports = {
  getPrice,
  getPrices,
  create,
  update
};