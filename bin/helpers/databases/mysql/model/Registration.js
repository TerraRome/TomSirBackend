const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');

class Registration extends Model {}
Registration.init(
  {
    id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    tanggal: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    jumlah: {
      type: Sequelize.INTEGER(11), // kg, gram, pcs, etc
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    merchant_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_registration'
  }
);

module.exports = Registration;
