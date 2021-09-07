const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../connection");
const Product = require('./Product');

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

PriceProduct.hasMany(Product, { 
  as: 'product',
  foreignKey: 'price_product_id',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Product.belongsTo(PriceProduct, { as: 'price_product', foreignKey: 'price_product_id' });

module.exports = PriceProduct;
