const joi = require('joi');

const getAddonCategory = joi.object({
  id: joi.string().required()
});

const getAddonCategories = joi.object({
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC'),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  })
});

const create = joi.object({
  name: joi.string().required(),
  is_required: joi.boolean().required(),
  max_limit: joi.number().required(),
  merchant_id: joi.string().required().messages({
    'any.required': `Akun anda tidak memiliki merchant`
  }),
  createdBy: joi.string().optional()
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  is_required: joi.boolean().required(),
  max_limit: joi.number().required()
});

module.exports = {
  getAddonCategory,
  getAddonCategories,
  create,
  update
};
