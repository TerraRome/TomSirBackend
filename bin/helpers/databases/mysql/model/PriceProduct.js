const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");

class PriceProduct extends Model {}
PriceProduct.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    price_info: {
      type: Sequelize.TEXT
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "tbl_price_product",
  }
);

module.exports = PriceProduct;
