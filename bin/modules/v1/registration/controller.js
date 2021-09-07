const { v4: uuidv4 } = require('uuid');
const model = require('./model');
const merchantModel = require('../merchant/model');
const excel = require('excel4node');
const moment = require('moment');
const config = require('../../../configs/config');

const getRegistration = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  return {
    err: null,
    data: result.data
  }
}

const getRegistrations = async (payload) => {
  const result = await model.findAll(payload);
  if(result.err) {
    return result;
  }

  result.data = {
    current_page: payload.page,
    countRegis: result.data.rows.length < payload.limit ? result.data.rows.length : payload.limit,
    total_page: Math.ceil(result.data.count / payload.limit),
    ...result.data
  }

  return {
    err: null,
    data: result.data
  }
}

const create = async (payload) => {
  const insertObj = {
    id: uuidv4(),
    tanggal: payload.tanggal,
    jumlah: payload.jumlah,
    status: payload.status,
    merchant_id: payload.merchant_id
  };

  const insert = await model.insertOne(insertObj);
  if(insert.err) {
    return insert;
  }

  return {
    err: null,
    data: insert.data
  }
}

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
  ws.cell(1, 3).string("Modal");

  let total_modal = 0;
  result.data.rows.map((t, tIndex) => {
    total_modal += t.jumlah
    ws.cell(tIndex + 2, 1).number(tIndex+1);
    ws.cell(tIndex + 2, 2).string(t.tanggal);
    ws.cell(tIndex + 2, 3).number(t.jumlah);
  });

  ws.cell(result.data.rows.length + 3, 1).string("Jumlah");
  ws.cell(result.data.rows.length + 3, 3).number(total_modal);

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
  getRegistration,
  getRegistrations,
  create,
  reportExcel
}