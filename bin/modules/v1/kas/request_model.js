const joi = require('joi');

const getKas = joi.object({
  id: joi.string().required()
});

const getAllKas = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('type','jumlah','deskripsi','createdAt').optional().default('name'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  merchant_id: joi.string().required()
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

module.exports = {
  getKas,
  getAllKas,
  create
};
