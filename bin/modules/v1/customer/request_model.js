const joi = require('joi');

const getUsers = joi.object({
  search: joi.string().optional().allow('').default(''),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name','email','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  name: joi.string().optional().allow('')
});

const create = joi.object({
  name: joi.string().required(),
  email: joi.string().optional(),
  phone_number: joi.string().required()
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  email: joi.string().optional(),
  phone_number: joi.string().required()
});

module.exports = {
  getUsers,
  create,
  update
};
