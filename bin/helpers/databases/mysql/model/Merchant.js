const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const User = require('./User');
const Category = require('./Category');
const Ingredient = require('./Ingredient');
const AddonCategory = require('./AddonCategory');
const Product = require('./Product');
const Transaction = require('./Transaction');
const Customer = require('./Customer');

class Merchant extends Model {}
Merchant.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    address: {
      type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.TEXT
    },
    phone_number: {
      type: Sequelize.STRING(30)
    },
    footer_note: {
      type: Sequelize.TEXT
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_merchant'
  }
);

Merchant.hasMany(User, { 
  as: 'user',
  foreignKey: 'merchant_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
User.belongsTo(Merchant, { as: 'merchant', foreignKey: 'merchant_id' });

Merchant.hasMany(Category, { 
  as: 'category',
  foreignKey: 'merchant_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Merchant.hasMany(Ingredient, { 
  as: 'ingredient',
  foreignKey: 'merchant_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Merchant.hasMany(AddonCategory, { 
  as: 'addon_category',
  foreignKey: 'merchant_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Merchant.hasMany(Product, { 
  as: 'product',
  foreignKey: 'merchant_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Merchant.hasMany(Transaction, { 
  as: 'transaction',
  foreignKey: 'merchant_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Merchant.hasMany(Customer, { 
    as: 'customer',
    foreignKey: 'merchant_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

module.exports = Merchant;
