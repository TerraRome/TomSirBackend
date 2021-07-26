const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const Product = require('./Product');

class TransactionProduct extends Model {}
TransactionProduct.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    qty: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    sub_total: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    note: {
      type: Sequelize.TEXT
    },
    transaction_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    product_id: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    product_info: {
      type: Sequelize.TEXT // json product detail
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_transaction_product'
  }
);

Product.hasMany(TransactionProduct, {
  as: 'transaction_product',
  foreignKey: 'product_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
TransactionProduct.belongsTo(Product, {
  as: 'product',
  foreignKey: 'product_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

module.exports = TransactionProduct;
