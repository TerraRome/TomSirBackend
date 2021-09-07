const { v4: uuidv4 } = require("uuid");
const model = require("./model");
const merchantModel = require('../merchant/model');
const excel = require('excel4node');
const moment = require('moment');
const config = require('../../../configs/config');

const getAllKas = async (payload) => {
  const result = await model.findAll(payload);
  if (result.err) {
    return result;
  }

  result.data = {
    current_page: payload.page,
    countKas:
      result.data.rows.length < payload.limit
        ? result.data.rows.length
        : payload.limit,
    total_page: Math.ceil(result.data.count / payload.limit),
    ...result.data,
  };

  return {
    err: null,
    data: result.data,
  };
};

const create = async (payload) => {
  const insertObj = {
    id: uuidv4(),
    tanggal: payload.tanggal,
    type: payload.type,
    jumlah: payload.jumlah,
    deskripsi: payload.deskripsi,
    merchant_id: payload.merchant_id,
  };

  const insert = await model.insertOne(insertObj);
  if (insert.err) {
    return insert;
  }

  return {
    err: null,
    data: insert.data,
  };
};

const update = async (payload) => {
  const userObj = {
    tanggal: payload.tanggal,
    type: payload.type,
    jumlah: payload.jumlah,
    deskripsi: payload.deskripsi,
    merchant_id: payload.merchant_id,
  };

  const update = await model.updateOne(userObj, payload);
  if (update.err) {
    return update;
  }

  return {
    err: null,
    data: update.data,
  };
};

const deleteOne = async (payload) => {
  const checkData = await model.findOneId(payload);
  if (checkData.err) {
    return checkData;
  }

  const deleteOne = await model.deleteOne(payload);
  if (deleteOne.err) {
    return deleteOne;
  }

  return {
    err: null,
    data: deleteOne.data,
  };
};

const reportExcel = async (payload) => {
  const rsMerchant = await merchantModel.findOne({ id: payload.merchant_id });
  if (rsMerchant.err) {
    return result;
  }

  const result = await model.findAll(payload);
  if (result.err) {
    return result;
  }

  const wb = new excel.Workbook();
  const ws = wb.addWorksheet("Sheet 1");

  ws.cell(1, 1).string("No");
  ws.cell(1, 2).string("Tanggal");
  ws.cell(1, 3).string("Debit");
  ws.cell(1, 4).string("Kredit");
  ws.cell(1, 5).string("Deskripsi");

  let total_debit = 0;
  let total_kredit = 0;
  let total_all = "";
  result.data.rows.map((t, tIndex) => {
    ws.cell(tIndex + 2, 1).number(tIndex+1);
    ws.cell(tIndex + 2, 2).string(t.tanggal);
    if (t.type == "debit") {
      ws.cell(tIndex + 2, 3).number(t.jumlah);
      ws.cell(tIndex + 2, 4).number(0);
      total_debit += t.jumlah;
    } else {
      ws.cell(tIndex + 2, 3).number(0);
      ws.cell(tIndex + 2, 4).number(t.jumlah);
      total_kredit += t.jumlah;
    }
    ws.cell(tIndex + 2, 5).string(t.deskripsi);
  });
  if(total_debit == total_kredit){
    total_all = "Balanced"
  }else{
    total_all = "Unbalanced"
  }

  ws.cell(result.data.rows.length + 3, 1).string("Jumlah");
  ws.cell(result.data.rows.length + 3, 3).number(total_debit);
  ws.cell(result.data.rows.length + 3, 4).number(total_kredit);
  ws.cell(result.data.rows.length + 3, 5).string(total_all);

  let excelName = `${moment(new Date()).format("YYYYMMDDHHmmss")}_${moment(
    payload.start_date
  ).format("YYYY-MM-DD")}_`;
  excelName += `${moment(payload.end_date).format("YYYY-MM-DD")}_${
    rsMerchant.data.name
  }.xlsx`;
  wb.write("./public/files/excel/" + excelName);

  return {
    err: null,
    data: config.baseUrl + "/files/excel/" + encodeURI(excelName),
  };
};

module.exports = {
  getAllKas,
  create,
  update,
  deleteOne,
  reportExcel,
};
