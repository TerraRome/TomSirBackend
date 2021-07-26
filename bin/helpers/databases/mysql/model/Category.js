const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const Product = require('./Product');

class Category extends Model {}
Category.init(
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
    icon: {
      type: Sequelize.TEXT
    },
    merchant_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    createdBy: {
      type: Sequelize.STRING(255)
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_category'
  }
);

Category.hasMany(Product, { 
  as: 'product',
  foreignKey: 'category_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Product.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

module.exports = Category;
