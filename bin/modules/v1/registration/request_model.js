const joi = require('joi');

const getRegistration = joi.object({
  tanggal: joi.string().required()
});

const create = joi.object({
  tanggal: joi.string().required(),
  jumlah: joi.number().optional(),
  status: joi.boolean().optional(),
  // merchant_id: joi.string().required().messages({
  //   'any.required': `Akun anda tidak memiliki merchant`
  // }),
});

module.exports = {
  getRegistration,
  create
};
