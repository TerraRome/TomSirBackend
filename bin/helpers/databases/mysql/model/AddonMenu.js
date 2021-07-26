const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');

class AddonMenu extends Model {}
AddonMenu.init(
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
    price: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    addon_category_id: {
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
    modelName: 'tbl_addon_menu'
  }
);


module.exports = AddonMenu;