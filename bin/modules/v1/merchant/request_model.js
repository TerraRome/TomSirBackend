const joi = require('joi');

const getMerchant = joi.object({
  id: joi.string().required()
});

const getMerchants = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name', 'createdAt').optional().default('name'),
  order: joi.string().valid('ASC', 'DESC').optional().default('ASC')
});

const create = joi.object({
  name: joi.string().required(),
  address: joi.string().optional().allow(''),
  phone_number: joi.string().optional().allow(''),
  footer_note: joi.string().optional().allow(''),
  // server_key: joi.string().required(),
  // client_key: joi.string().required(),
  image: joi.object().optional(),
  size: joi.number().max(10000000).optional(),
  ext: joi.string().valid('jpg', 'jpeg', 'png', 'svg', 'gif').optional()
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  address: joi.string().optional().allow(''),
  phone_number: joi.string().optional().allow(''),
  footer_note: joi.string().optional().allow(''),
  // server_key: joi.string().required(),
  // client_key: joi.string().required(),
  image: joi.object().optional(),
  size: joi.number().max(10000000).optional(),
  ext: joi.string().valid('jpg', 'jpeg', 'png', 'svg', 'gif').optional()
});

module.exports = {
  getMerchant,
  getMerchants,
  create,
  update
};
