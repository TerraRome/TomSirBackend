const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const AddonCategory = require('./AddonCategory');
const AddonMenu = require('./AddonMenu');
const Category = require('./Category');
const Ingredient = require('./Ingredient');
const Product = require('./Product');

class User extends Model {}
User.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    fullname: {
      type: Sequelize.STRING(255)
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    role: {
      type: Sequelize.STRING(20)
    },
    merchant_id: {
      type: Sequelize.STRING(255)
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_user'
  }
);

User.hasMany(AddonCategory, { 
  as: 'addon_category',
  foreignKey: 'createdBy',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
AddonCategory.belongsTo(User, { as: 'user', foreignKey: 'createdBy' });

User.hasMany(AddonMenu, { 
  as: 'addon_menu',
  foreignKey: 'createdBy',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
AddonMenu.belongsTo(User, { as: 'user', foreignKey: 'createdBy' });

User.hasMany(Category, { 
  as: 'category',
  foreignKey: 'createdBy',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Category.belongsTo(User, { as: 'user', foreignKey: 'createdBy' });

User.hasMany(Ingredient, { 
  as: 'ingredient',
  foreignKey: 'createdBy',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Ingredient.belongsTo(User, { as: 'user', foreignKey: 'createdBy' });

User.hasMany(Product, { 
  as: 'product',
  foreignKey: 'createdBy',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Product.belongsTo(User, { as: 'user', foreignKey: 'createdBy' });

module.exports = User;
