const joi = require('joi');

const getTypeOrder = joi.object({
  id: joi.string().required()
});

const getTypeOrders = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name','status','createdAt').optional().default('name'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  merchant_id: joi.string().required()
});

const create = joi.object({
  name: joi.string().required(),
  status: joi.boolean().required(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  status: joi.boolean().optional(),
  merchant_id: joi.string().required(),
});

module.exports = {
  getTypeOrder,
  getTypeOrders,
  create,
  update
};