const joi = require('joi');

const getProfile = joi.object({
  email: joi.string().required(),
});

const updateProfile = joi.object({
  email: joi.string().required(),
  fullname: joi.string().required()
});

const changePassword = joi.object({
  email: joi.string().required(),
  old_password: joi.string().required(),
  new_password: joi.string().required(),
});

const getUser = joi.object({
  id: joi.string().required()
});

const getUsers = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('fullname','email','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  merchant_id: joi.string().optional().allow('')
});

const create = joi.object({
  email: joi.string().required(),
  fullname: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().valid('admin','staff').required(),
  merchant_id: joi.string().required()
});

const update = joi.object({
  id: joi.string().required(),
  email: joi.string().required(),
  fullname: joi.string().required(),
  password: joi.string().optional().allow('').default(''),
  role: joi.string().valid('admin','staff').required(),
  merchant_id: joi.string().optional()
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUser,
  getUsers,
  create,
  update
};
