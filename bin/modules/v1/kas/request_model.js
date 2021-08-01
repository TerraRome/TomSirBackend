const joi = require('joi');

const getKas = joi.object({
  id: joi.string().required()
});

const create = joi.object({
  tanggal: joi.string().required(),
  type: joi.string().required(),
  jumlah: joi.number().optional(),
  deskripsi: joi.string().optional(),
  // merchant_id: joi.string().required().messages({
  //   'any.required': `Akun anda tidak memiliki merchant`
  // }),
});

module.exports = {
  getKas,
  create
};
