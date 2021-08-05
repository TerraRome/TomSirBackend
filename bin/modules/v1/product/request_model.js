const joi = require('joi');

const getProduct = joi.object({
  id: joi.string().required()
});

const getProducts = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name','price','createdAt').optional().default('name'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  category_id: joi.string().optional(),
  merchant_id: joi.string().required()
});

const create = joi.object({
  name: joi.string().required(),
  description: joi.string().optional().allow(''),
  stock: joi.number().required(),
  modal: joi.number().required(),
  price: joi.number().required(),
  sku: joi.string().required(),
  barcode: joi.string().required(),
  sell_type: joi.boolean().required(),
  exp_date: joi.date().optional(),
  category_id: joi.string().required(),
  addon_categories: joi.array().optional(),
  ingredients: joi.array().items(joi.object({
    qty: joi.number().required(),
    id: joi.string().required(),
  }).optional()).optional(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
  createdBy: joi.string().optional(),
  image: joi.object().optional(),
  size: joi.number().max(10000000).optional(),
  ext: joi.string().valid('jpg','jpeg','png','svg','gif').optional()
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  description: joi.string().optional().allow(''),
  stock: joi.number().required(),
  modal: joi.number().required(),
  price: joi.number().required(),
  sku: joi.string().required(),
  barcode: joi.string().required(),
  sell_type: joi.boolean().required(),
  disc: joi.number().required(),
  is_disc_percentage: joi.boolean().required(),
  exp_date: joi.date().optional(),
  category_id: joi.string().required(),
  addon_categories: joi.array().optional(),
  ingredients: joi.array().items(joi.object({
    qty: joi.number().required(),
    id: joi.string().required(),
  }).optional()).optional(),
  image: joi.object().optional(),
  size: joi.number().max(10000000).optional(),
  ext: joi.string().valid('jpg','jpeg','png','svg','gif').optional()
});

module.exports = {
  getProduct,
  getProducts,
  create,
  update
};
