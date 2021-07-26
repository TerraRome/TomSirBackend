const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');

class Ingredient extends Model {}
Ingredient.init(
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
    unit: {
      type: Sequelize.STRING(255), // kg, gram, pcs, etc
      allowNull: false
    },
    stock: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    exp_date: {
      type: Sequelize.DATEONLY
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
    modelName: 'tbl_ingredient'
  }
);

module.exports = Ingredient;
