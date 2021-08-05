const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('../connection');

class Kas extends Model {}
Kas.init(
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
    type: {
      type: Sequelize.STRING(11), // kg, gram, pcs, etc
      allowNull: false
    },
    jumlah: {
      type: Sequelize.INTEGER(11), // kg, gram, pcs, etc
      allowNull: false
    },
    deskripsi: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    merchant_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'tbl_kas'
  }
);

module.exports = Kas;
