const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const TransactionProduct = require('./TransactionProduct');

class Transaction extends Model {}
Transaction.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    type: {
      type: Sequelize.STRING(255), // dine_in | take_away, etc
      allowNull: false
    },
    note: {
      type: Sequelize.TEXT
    },
    tax_percentage: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    total_price: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    total_tax: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    payment_type: {
      type: Sequelize.STRING(255), // cash | debit | e-wallet, etc
      allowNull: false
    },
    total_pay: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    payment_return: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    merchant_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_transaction'
  }
);

Transaction.hasMany(TransactionProduct, {
  as: 'transaction_product',
  foreignKey: 'transaction_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
TransactionProduct.belongsTo(Transaction, { as: 'transaction', foreignKey: 'transaction_id' });

module.exports = Transaction;
