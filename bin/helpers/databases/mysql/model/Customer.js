const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");
const Transaction = require("./Transaction");

class Customer extends Model {}
Customer.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    phone_number: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    merchant_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "tbl_customer",
  }
);

Customer.hasMany(Transaction, {
  as: "transaction",
  foreignKey: "note",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Customer;
