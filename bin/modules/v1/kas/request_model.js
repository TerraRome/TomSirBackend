const joi = require('joi');

const getKas = joi.object({
  id: joi.string().required()
});

const getAllKas = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('type','jumlah','deskripsi','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  start_date: joi.date().optional().allow('').default(''),
  end_date: joi.date().optional().allow('').default(''),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  })
});

const create = joi.object({
  tanggal: joi.string().required(),
  type: joi.string().required(),
  jumlah: joi.number().optional(),
  deskripsi: joi.string().optional(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
});

const update = joi.object({
  id: joi.string().required(),
  tanggal: joi.string().required(),
  type: joi.string().optional(),
  jumlah: joi.number().required(),
  deskripsi: joi.string().optional(),
  merchant_id: joi.string().required(),
});

module.exports = {
  getKas,
  getAllKas,
  create,
  update
};
