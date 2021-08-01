const joi = require('joi');

const getOrder = joi.object({
  id: joi.string().required()
});

const getOrders = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(10000000000000),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('type','code','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  status: joi.string().valid('paid','hold','refund').optional().allow('').default(''),
  type: joi.string().valid('dine_in','take_away').optional().allow('').default(''),
  start_date: joi.date().optional().allow('').default(''),
  end_date: joi.date().optional().allow('').default(''),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  })
});

const create = joi.object({
  type_order: joi.string().valid('dine_in','take_away').required(),
  note_order: joi.string().optional().allow('').default(''),
  products: joi.array().items(joi.object({
    qty: joi.number().required(),
    price: joi.number().required(),
    note: joi.string().optional().allow('').default(''),
    id: joi.string().required(),
    addons: joi.array().optional()
  }).required()).required(),
  tax_order_percentage: joi.number().required(),
  total_price: joi.number().optional(),
  total_tax: joi.number().optional(),
  payment_type: joi.string().valid('cash').required(),
  total_pay: joi.number().required(),
  payment_return: joi.number().optional(),
  status: joi.string().valid('paid','hold').required(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  })
});

const update = joi.object({
  id: joi.string().required(),
  type_order: joi.string().valid('dine_in','take_away').required(),
  note_order: joi.string().optional().allow('').default(''),
  products: joi.array().items(joi.object({
    qty: joi.number().required(),
    price: joi.number().required(),
    note: joi.string().optional().allow('').default(''),
    id: joi.string().required(),
    transaction_product_id: joi.string().optional().allow(''),
    addons: joi.array().optional()
  }).required()).required(),
  tax_order_percentage: joi.number().required(),
  total_price: joi.number().optional(),
  total_tax: joi.number().optional(),
  payment_type: joi.string().valid('cash').required(),
  total_pay: joi.number().required(),
  payment_return: joi.number().optional(),
  status: joi.string().valid('paid','hold','refund').required()
});

const addProduct = joi.object({
  id: joi.string().required(), // transaction_id
  products: joi.array().items(joi.object({
    qty: joi.number().required(),
    price: joi.number().required(),
    note: joi.string().optional().allow('').default(''),
    id: joi.string().required(),
    addons: joi.array().optional()
  }).required()).required(),
})

const updateProduct = joi.object({
  qty: joi.number().required(),
  price: joi.number().required(),
  note: joi.string().optional().allow('').default(''),
  id: joi.string().required(), // transaction_product_id
  addons: joi.array().optional()
});

const deleteProduct = joi.object({
  id: joi.string().required() // transaction_product_id
});

const payOrder = joi.object({
  id: joi.string().required(), // transaction_id
  tax_order_percentage: joi.number().required(),
  total_price: joi.number().optional(),
  total_tax: joi.number().optional(),
  payment_type: joi.string().valid('cash').required(),
  total_pay: joi.number().required(),
  payment_return: joi.number().optional()
});

const reportSummary = joi.object({
  search: joi.string().optional().allow('').default(''),
  start_date: joi.date().optional().allow('').default(''),
  end_date: joi.date().optional().allow('').default(''),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  })
});

module.exports = {
  getOrder,
  getOrders,
  create,
  update,
  addProduct,
  updateProduct,
  deleteProduct,
  payOrder,
  reportSummary
};
