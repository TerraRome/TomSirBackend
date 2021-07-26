const joi = require('joi');

const getCategory = joi.object({
  id: joi.string().required()
});

const getCategories = joi.object({
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  merchant_id: joi.string().required()
});

const create = joi.object({
  name: joi.string().required(),
  icon: joi.string().optional(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
  createdBy: joi.string().optional()
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  icon: joi.string().optional()
});

module.exports = {
  getCategory,
  getCategories,
  create,
  update
};
