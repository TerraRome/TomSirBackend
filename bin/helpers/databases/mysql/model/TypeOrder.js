const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class TypeOrder extends Model {}
TypeOrder.init(
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
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    note: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    merchant_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: "tbl_type_order",
  }
);

module.exports = TypeOrder;
