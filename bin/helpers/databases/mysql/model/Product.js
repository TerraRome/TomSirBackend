const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');

class Product extends Model {}
Product.init(
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
    description: {
      type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.TEXT
    },
    stock: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    disc: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    is_disc_percentage: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    exp_date: {
      type: Sequelize.DATEONLY
    },
    category_id: {
      type: Sequelize.STRING(255),
      allowNull: true
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
    modelName: 'tbl_product'
  }
);

module.exports = Product;
