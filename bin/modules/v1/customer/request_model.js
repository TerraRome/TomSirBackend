const joi = require('joi');

const getCustomer = joi.object({
  id: joi.string().required(),
});

const getCustomers = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name', 'createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC', 'DESC').optional().default('ASC'),
  merchant_id: joi.string().required()
});

const create = joi.object({
  name: joi.string().required(),
  email: joi.string().optional(),
  phone_number: joi.string().required(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  email: joi.string().optional(),
  phone_number: joi.string().required(),
  merchant_id: joi.string().required(),
});

module.exports = {
  getCustomer,
  getCustomers,
  create,
  update
};
