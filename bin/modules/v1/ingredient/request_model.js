const joi = require('joi');

const getIngredient = joi.object({
  id: joi.string().required()
});

const getIngredients = joi.object({
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name','unit','stock','price','exp_date','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  })
});

const create = joi.object({
  name: joi.string().required(),
  unit: joi.string().required(),
  stock: joi.number().required(),
  price: joi.number().required(),
  exp_date: joi.date().optional(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
  createdBy: joi.string().optional()
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  unit: joi.string().required(),
  stock: joi.number().required(),
  price: joi.number().required(),
  exp_date: joi.date().optional(),
});

module.exports = {
  getIngredient,
  getIngredients,
  create,
  update
};
