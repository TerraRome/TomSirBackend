const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');
const AddonMenu = require('./AddonMenu');

class AddonCategory extends Model {}
AddonCategory.init(
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
    is_required: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    max_limit: {
      type: Sequelize.INTEGER(11), // if 1==radio, 2=>checkbox
      allowNull: false
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
    modelName: 'tbl_addon_category'
  }
);

AddonCategory.hasMany(AddonMenu, { 
  as: 'addon_menu',
  foreignKey: 'addon_category_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = AddonCategory;