const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const Product = require('./Product');
const AddonCategory = require('./AddonCategory');

class ProductAddon extends Model {}
ProductAddon.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    addon_category_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_product_addon'
  }
);

Product.belongsToMany(AddonCategory, {
  as: 'addon_category',
  through: 'tbl_product_addon',
  foreignKey: 'product_id',
  otherKey: 'addon_category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AddonCategory.belongsToMany(Product, {
  through: 'tbl_product_addon',
  foreignKey: 'addon_category_id',
  otherKey: 'product_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = ProductAddon;