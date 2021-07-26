const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const Product = require('./Product');
const Ingredient = require('./Ingredient');

class ProductIngredient extends Model {}
ProductIngredient.init(
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
    ingredient_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    qty: {
      type: Sequelize.INTEGER(11)
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_product_ingredient'
  }
);

Product.belongsToMany(Ingredient, {
  as: 'ingredient',
  through: 'tbl_product_ingredient',
  foreignKey: 'product_id',
  otherKey: 'ingredient_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Ingredient.belongsToMany(Product, {
  through: 'tbl_product_ingredient',
  foreignKey: 'ingredient_id',
  otherKey: 'product_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = ProductIngredient;