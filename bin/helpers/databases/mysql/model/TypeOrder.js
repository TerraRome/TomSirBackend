const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class TypeOrder extends Model { }
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
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
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
