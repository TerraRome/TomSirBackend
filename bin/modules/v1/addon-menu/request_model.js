const joi = require('joi');

const getAddonMenu = joi.object({
  id: joi.string().required()
});

const getAddonMenusByCategoryId = joi.object({
  addon_category_id: joi.string().required(),
  limit: joi.number().optional().default(999999999),
  page: joi.number().optional().default(1),
  sortBy: joi.string().valid('name','createdAt').optional().default('createdAt'),
  order: joi.string().valid('ASC','DESC').optional().default('ASC')
});

const create = joi.object({
  name: joi.string().required(),
  is_active: joi.boolean().required(),
  price: joi.number().required(),
  addon_category_id: joi.string().required(),
  createdBy: joi.string().optional()
});

const update = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  is_active: joi.boolean().required(),
  price: joi.number().required()
});

module.exports = {
  getAddonMenu,
  getAddonMenusByCategoryId,
  create,
  update
};
