const joi = require('joi');

const getRegistration = joi.object({
  tanggal: joi.string().required()
});

const getRegistrations = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(10000000000000),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  start_date: joi.date().optional().allow('').default(''),
  end_date: joi.date().optional().allow('').default(''),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  })
});

const create = joi.object({
  tanggal: joi.string().required(),
  jumlah: joi.number().optional(),
  status: joi.boolean().optional(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
});

module.exports = {
  getRegistration,
  getRegistrations,
  create
};
