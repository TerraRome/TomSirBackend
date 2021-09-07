const { v4: uuidv4 } = require('uuid');
const excel = require('excel4node');
const moment = require('moment');
const config = require('../../../configs/config');
const model = require('./model');
const productModel = require('../product/model');
const ingredientModel = require('../ingredient/model');
const addonMenuModel = require('../addon-menu/model');
const merchantModel = require('../merchant/model');

const getOrder = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  let total_capital = 0;
  let total_qty = 0;
  let isProductExist = true;
  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;

    isProductExist = d.product ? true : false;
    let capitalOneProduct = 0;
    if(isProductExist) {
      d.product.ingredient.map(i => {
        capitalOneProduct += i.price * i.tbl_product_ingredient.qty
      });
      total_capital += d.qty * capitalOneProduct;
    }
    total_qty += d.qty;
    return {
      ...d,
      addons: product_info.addons,
      product: d.product ? {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      } : d.product
    }
  })
  result.data.total_capital = total_capital;
  result.data.total_qty = total_qty;
  result.data.profit = result.data.total_price - result.data.total_capital;

  return {
    err: null,
    data: result.data
  }
}

const getOrders = async (payload) => {
  const result = await model.findAll(payload);
  if(result.err) {
    return result;
  }

  result.data = {
    current_page: payload.page,
    page_size: result.data.rows.length < payload.limit ? result.data.rows.length : payload.limit,
    total_page: Math.ceil(result.data.count / payload.limit),
    ...result.data
  }

  return {
    err: null,
    data: result.data
  }
}

const create = async (payload) => {
  let listProductId = [];
  let listAddonId = [];
  for (let i = 0; i < payload.products.length; i++) {
    listProductId.push(payload.products[i].id);
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      listAddonId.push(payload.products[i].addons[j]);
    }
  }

  const listProduct = await productModel.findMultpileWithIngredient(listProductId);
  if(listProduct.err) {
    return listProduct;
  }

  const listAddon = await addonMenuModel.findMultpile(listAddonId);
  if(listAddon.err) {
    return listAddon;
  }

  const transactionObj = {
    id: uuidv4(),
    code: payload.type_order == 'dine_in' ? 'DI-' : 'TA-',
    type: payload.type_order,
    note: payload.note_order,
    tax_percentage: payload.tax_order_percentage,
    total_price: 0,
    total_tax: 0,
    payment_type: payload.payment_type,
    total_pay: payload.total_pay,
    payment_return: 0,
    status: payload.status,
    merchant_id: payload.merchant_id
  };

  let transactionProductObj = [];
  let listUsedIngredient = [];
  let listProductUnavailable = [];
  let listAddonUnavailable = [];
  let listProductNewStock = [];
  for (let i = 0; i < payload.products.length; i++) {
    
    let currProduct = listProduct.data.find(d => d.id == payload.products[i].id);
    if(!currProduct) {
      listProductUnavailable.push({
        id: payload.products[i].id
      });
      continue;
    }
    currProduct = currProduct.dataValues;
    currProduct.image = config.baseUrl + currProduct.image;

    if(currProduct.stock < payload.products[i].qty) {
      listProductUnavailable.push({
        id: currProduct.id,
        name: currProduct.name
      });
    } else {
      let checkIndex = listProductNewStock.findIndex(d => d.id == currProduct.id);
      if(checkIndex < 0) {
        listProductNewStock.push({
          id: currProduct.id,
          qty: payload.products[i].qty
        });
      } else {
        listProductNewStock[checkIndex].qty += payload.products[i].qty;
      }
    }

    let sub_total = payload.products[i].qty * payload.products[i].price;
    if(currProduct.disc > 0) {
    // if(currProduct.disc > 0 && new Date() < new Date(currProduct.exp_date)) {
      let subtract_price = currProduct.disc;
      if(currProduct.is_disc_percentage) {
        subtract_price = currProduct.price * currProduct.disc / 100;
      }
      sub_total -= (payload.products[i].qty * subtract_price);
    }
    
    currProduct.addons = [];
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      let currAddon = listAddon.data.find(d => d.id == payload.products[i].addons[j]);
      if(!currAddon) {
        listAddonUnavailable.push({
          id: payload.products[i].addons[j]
        });
        continue;
      }
      currProduct.addons.push(currAddon);
      sub_total += (payload.products[i].qty * currAddon.price);
    }

    transactionProductObj.push({
      id: uuidv4(),
      qty: payload.products[i].qty,
      sub_total: sub_total,
      note: payload.products[i].note,
      transaction_id: transactionObj.id,
      product_id: payload.products[i].id,
      product_info: JSON.stringify(currProduct)
    })
    transactionObj.total_price += sub_total;

    for (let j = 0; j < currProduct.ingredient.length; j++) {
      let checkIndex = listUsedIngredient.findIndex(d => d.id == currProduct.ingredient[j].id);
      if(checkIndex < 0) {
        listUsedIngredient.push({
          id: currProduct.ingredient[j].id,
          qty: payload.products[i].qty * currProduct.ingredient[j].tbl_product_ingredient.qty
        })
      } else {
        listUsedIngredient[checkIndex].qty += payload.products[i].qty * currProduct.ingredient[j].tbl_product_ingredient.qty;
      }
    }
  }
  console.log(listProductUnavailable)
  if(listProductUnavailable.length > 0) {
    return {
      err: {
        data: listProductUnavailable,
        message: 'Some menu unavailable!',
        code: 400
      },
      data: null
    };
  }
  if(listAddonUnavailable.length > 0) {
    return {
      err: {
        data: listAddonUnavailable,
        message: 'Some addon unavailable!',
        code: 400
      },
      data: null
    };
  }

  let code_number = 1;
  const lastTransaction = await model.findLastTransaction({ code: transactionObj.code, merchant_id: payload.merchant_id });
  if(lastTransaction.err) {
    if(lastTransaction.err.code !== 404) {
      return lastTransaction;
    }
  } else {
    code_number = parseInt(lastTransaction.data.code.split('-')[1]) + 1;
  }

  let nol_code_number = "";
  for (let i = 0; i < 6 - code_number.toString().length; i++) {
    nol_code_number += "0";
  }

  transactionObj.code = transactionObj.code + nol_code_number + code_number;
  transactionObj.total_tax = transactionObj.total_price * transactionObj.tax_percentage / 100;
  transactionObj.total_price += transactionObj.total_tax;
  transactionObj.payment_return = transactionObj.total_pay - transactionObj.total_price;

  const insertTransaction = await model.insertTransaction(transactionObj);
  if(insertTransaction.err) {
    return insertTransaction;
  }

  const insertTransactionProduct = await model.insertTransactionProduct(transactionProductObj);
  if(insertTransactionProduct.err) {
    return insertTransactionProduct;
  }

  productModel.updateStock(listProductNewStock);
  ingredientModel.updateStock(listUsedIngredient);

  const result = await model.findOne({ id: transactionObj.id })
  if(result.err) {
    return result;
  }

  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;
    return {
      ...d,
      addons: product_info.addons,
      product: d.product ? {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      } : d.product
    }
  })

  return {
    err: null,
    data: result.data
  }
}

const update = async (payload) => {
  const checkTrans = await model.findOne(payload)
  if(checkTrans.err) {
    return checkTrans;
  }

  if(checkTrans.data.status != 'hold') {
    return {
      err: {
        message: 'You can only update `hold` transaction!'+checkTrans.data.status,
        code: 400
      },
      data: null
    };
  }

  const transactionObj = {
    type: payload.type_order,
    note: payload.note_order,
    tax_percentage: payload.tax_order_percentage,
    total_price: 0,
    total_tax: 0,
    payment_type: payload.payment_type,
    total_pay: payload.total_pay,
    payment_return: 0,
    status: payload.status
  };

  let listProductAddId = [];
  let listTransProductId = [];
  let listAddonId = [];
  for (let i = 0; i < payload.products.length; i++) {
    if(payload.products[i].transaction_product_id) {
      listTransProductId.push(payload.products[i].transaction_product_id);
    } else {
      listProductAddId.push(payload.products[i].id);
    }
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      listAddonId.push(payload.products[i].addons[j]);
    }
  }

  const listProductAdd = await productModel.findMultpileWithIngredient(listProductAddId);
  if(listProductAdd.err) {
    return listProductAdd;
  }

  const listTransProduct = await model.findMultipleTransactionProduct(listTransProductId);
  if(listTransProduct.err && listTransProduct.err.code !== 404) {
    return listTransProduct;
  }

  const listAddon = await addonMenuModel.findMultpile(listAddonId);
  if(listAddon.err) {
    return listAddon;
  }

  let transactionProductObj = [];
  let listUsedIngredient = [];
  let listProductUnavailable = [];
  let listAddonUnavailable = [];
  let listProductNewStock = [];

  for (let i = 0; i < checkTrans.data.transaction_product.length; i++) {
    let checkIndex = payload.products.findIndex(d => d.transaction_product_id == checkTrans.data.transaction_product[i].id);
    if(checkIndex < 0) {
      let checkProductIndex = listProductNewStock.findIndex(d => d.id == checkTrans.data.transaction_product[i].product.id);
      if(checkProductIndex < 0) {
        listProductNewStock.push({
          id: checkTrans.data.transaction_product[i].product.id,
          qty: 0 - checkTrans.data.transaction_product[i].qty
        });
      } else {
        listProductNewStock[checkProductIndex].qty += (0 - checkTrans.data.transaction_product[i].qty);
      }
      for (let j = 0; j < checkTrans.data.transaction_product[i].product.ingredient.length; j++) {
        let checkIngredientIndex = listUsedIngredient.findIndex(d => d.id == checkTrans.data.transaction_product[i].product.ingredient[j].id);
        if(checkIngredientIndex < 0) {
          listUsedIngredient.push({
            id: checkTrans.data.transaction_product[i].product.ingredient[j].id,
            qty: 0 - (checkTrans.data.transaction_product[i].qty * checkTrans.data.transaction_product[i].product.ingredient[j].tbl_product_ingredient.qty)
          })
        } else {
          listUsedIngredient[checkIngredientIndex].qty += (0 - (checkTrans.data.transaction_product[i].qty * checkTrans.data.transaction_product[i].product.ingredient[j].tbl_product_ingredient.qty));
        }
      }
    }
  }

  for (let i = 0; i < payload.products.length; i++) {
    let currProduct = listProductAdd.data.find(d => d.id == payload.products[i].id);
    let diffQty = payload.products[i].qty;
    if(payload.products[i].transaction_product_id) {
      let checkTransProduct = listTransProduct.data.find(d => d.id == payload.products[i].transaction_product_id);
      diffQty -= checkTransProduct.dataValues.qty;
      currProduct = checkTransProduct.dataValues.product;
    }
    if(!currProduct) {
      listProductUnavailable.push({
        id: payload.products[i].id
      });
      continue;
    }
    currProduct = currProduct.dataValues;
    currProduct.image = config.baseUrl + currProduct.image;

    if(currProduct.stock < diffQty) {
      listProductUnavailable.push({
        id: currProduct.id,
        name: currProduct.name,
        stock: currProduct.stock
      });
    } else {
      let checkIndex = listProductNewStock.findIndex(d => d.id == currProduct.id);
      if(checkIndex < 0) {
        listProductNewStock.push({
          id: currProduct.id,
          qty: diffQty
        });
      } else {
        listProductNewStock[checkIndex].qty += diffQty; 
      }
    }

    let sub_total = payload.products[i].qty * currProduct.price;
    if(currProduct.disc > 0) {
    // if(currProduct.disc > 0 && new Date() < new Date(currProduct.exp_date)) {
      let subtract_price = currProduct.disc;
      if(currProduct.is_disc_percentage) {
        subtract_price = currProduct.price * currProduct.disc / 100;
      }
      sub_total -= (payload.products[i].qty * subtract_price);
    }
    
    currProduct.addons = [];
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      let currAddon = listAddon.data.find(d => d.id == payload.products[i].addons[j]);
      if(!currAddon) {
        listAddonUnavailable.push({
          id: payload.products[i].addons[j]
        });
        continue;
      }
      currProduct.addons.push(currAddon);
      sub_total += (payload.products[i].qty * currAddon.price);
    }

    transactionProductObj.push({
      id: uuidv4(),
      qty: payload.products[i].qty,
      sub_total: sub_total,
      note: payload.products[i].note,
      transaction_id: checkTrans.data.id,
      product_id: payload.products[i].id,
      product_info: JSON.stringify(currProduct)
    })
    transactionObj.total_price += sub_total;

    for (let j = 0; j < currProduct.ingredient.length; j++) {
      let checkIndex = listUsedIngredient.findIndex(d => d.id == currProduct.ingredient[j].id);
      if(checkIndex < 0) {
        listUsedIngredient.push({
          id: currProduct.ingredient[j].id,
          qty: diffQty * currProduct.ingredient[j].tbl_product_ingredient.qty
        })
      } else {
        listUsedIngredient[checkIndex].qty += diffQty * currProduct.ingredient[j].tbl_product_ingredient.qty;
      }
    }
  }

  if(listProductUnavailable.length > 0) {
    return {
      err: {
        data: listProductUnavailable,
        message: 'Some menu unavailable!',
        code: 400
      },
      data: null
    };
  }
  if(listAddonUnavailable.length > 0) {
    return {
      err: {
        data: listAddonUnavailable,
        message: 'Some addon unavailable!',
        code: 400
      },
      data: null
    };
  }

  transactionObj.total_tax = transactionObj.total_price * transactionObj.tax_percentage / 100;
  transactionObj.total_price += transactionObj.total_tax;
  transactionObj.payment_return = transactionObj.total_pay - transactionObj.total_price;

  const deleteTransactionProduct = await model.deleteTransactionProductByTransactionId({ id: checkTrans.data.id });
  if(deleteTransactionProduct.err) {
    return deleteTransactionProduct;
  }

  const updateTransaction = await model.updateTransaction(transactionObj, { id: checkTrans.data.id });
  if(updateTransaction.err) {
    return updateTransaction;
  }

  const insertTransactionProduct = await model.insertTransactionProduct(transactionProductObj);
  if(insertTransactionProduct.err) {
    return insertTransactionProduct;
  }

  productModel.updateStock(listProductNewStock);
  ingredientModel.updateStock(listUsedIngredient);

  const result = await model.findOne({ id: checkTrans.data.id })
  if(result.err) {
    return result;
  }

  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;
    return {
      ...d,
      addons: product_info.addons,
      product: d.product ? {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      } : d.product
    }
  })

  return {
    err: null,
    data: result.data
  }  
}

const refund = async (payload) => {
  const checkTrans = await model.findOne(payload)
  if(checkTrans.err) {
    return checkTrans;
  }

  const transactionObj = {
    type: payload.type_order,
    note: payload.note_order,
    tax_percentage: payload.tax_order_percentage,
    total_price: 0,
    total_tax: 0,
    payment_type: payload.payment_type,
    total_pay: payload.total_pay,
    payment_return: 0,
    status: payload.status
  };

  let listProductAddId = [];
  let listTransProductId = [];
  let listAddonId = [];
  for (let i = 0; i < payload.products.length; i++) {
    if(payload.products[i].transaction_product_id) {
      listTransProductId.push(payload.products[i].transaction_product_id);
    } else {
      listProductAddId.push(payload.products[i].id);
    }
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      listAddonId.push(payload.products[i].addons[j]);
    }
  }

  const listProductAdd = await productModel.findMultpileWithIngredient(listProductAddId);
  if(listProductAdd.err) {
    return listProductAdd;
  }

  const listTransProduct = await model.findMultipleTransactionProduct(listTransProductId);
  if(listTransProduct.err && listTransProduct.err.code !== 404) {
    return listTransProduct;
  }

  const listAddon = await addonMenuModel.findMultpile(listAddonId);
  if(listAddon.err) {
    return listAddon;
  }

  let transactionProductObj = [];
  let listUsedIngredient = [];
  let listProductUnavailable = [];
  let listAddonUnavailable = [];
  let listProductNewStock = [];

  for (let i = 0; i < checkTrans.data.transaction_product.length; i++) {
    let checkIndex = payload.products.findIndex(d => d.transaction_product_id == checkTrans.data.transaction_product[i].id);
    if(checkIndex < 0) {
      let checkProductIndex = listProductNewStock.findIndex(d => d.id == checkTrans.data.transaction_product[i].product.id);
      if(checkProductIndex < 0) {
        listProductNewStock.push({
          id: checkTrans.data.transaction_product[i].product.id,
          qty: 0 - checkTrans.data.transaction_product[i].qty
        });
      } else {
        listProductNewStock[checkProductIndex].qty += (0 - checkTrans.data.transaction_product[i].qty);
      }
      for (let j = 0; j < checkTrans.data.transaction_product[i].product.ingredient.length; j++) {
        let checkIngredientIndex = listUsedIngredient.findIndex(d => d.id == checkTrans.data.transaction_product[i].product.ingredient[j].id);
        if(checkIngredientIndex < 0) {
          listUsedIngredient.push({
            id: checkTrans.data.transaction_product[i].product.ingredient[j].id,
            qty: 0 - (checkTrans.data.transaction_product[i].qty * checkTrans.data.transaction_product[i].product.ingredient[j].tbl_product_ingredient.qty)
          })
        } else {
          listUsedIngredient[checkIngredientIndex].qty += (0 - (checkTrans.data.transaction_product[i].qty * checkTrans.data.transaction_product[i].product.ingredient[j].tbl_product_ingredient.qty));
        }
      }
    }
  }

  for (let i = 0; i < payload.products.length; i++) {
    let currProduct = listProductAdd.data.find(d => d.id == payload.products[i].id);
    let diffQty = payload.products[i].qty;
    if(payload.products[i].transaction_product_id) {
      let checkTransProduct = listTransProduct.data.find(d => d.id == payload.products[i].transaction_product_id);
      diffQty -= checkTransProduct.dataValues.qty;
      currProduct = checkTransProduct.dataValues.product;
    }
    if(!currProduct) {
      listProductUnavailable.push({
        id: payload.products[i].id
      });
      continue;
    }
    currProduct = currProduct.dataValues;
    currProduct.image = config.baseUrl + currProduct.image;

    if(currProduct.stock < diffQty) {
      listProductUnavailable.push({
        id: currProduct.id,
        name: currProduct.name,
        stock: currProduct.stock
      });
    } else {
      let checkIndex = listProductNewStock.findIndex(d => d.id == currProduct.id);
      if(checkIndex < 0) {
        listProductNewStock.push({
          id: currProduct.id,
          qty: diffQty
        });
      } else {
        listProductNewStock[checkIndex].qty += diffQty; 
      }
    }

    let sub_total = payload.products[i].qty * currProduct.price;
    if(currProduct.disc > 0) {
    // if(currProduct.disc > 0 && new Date() < new Date(currProduct.exp_date)) {
      let subtract_price = currProduct.disc;
      if(currProduct.is_disc_percentage) {
        subtract_price = currProduct.price * currProduct.disc / 100;
      }
      sub_total -= (payload.products[i].qty * subtract_price);
    }
    
    currProduct.addons = [];
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      let currAddon = listAddon.data.find(d => d.id == payload.products[i].addons[j]);
      if(!currAddon) {
        listAddonUnavailable.push({
          id: payload.products[i].addons[j]
        });
        continue;
      }
      currProduct.addons.push(currAddon);
      sub_total += (payload.products[i].qty * currAddon.price);
    }

    transactionProductObj.push({
      id: uuidv4(),
      qty: payload.products[i].qty,
      sub_total: sub_total,
      note: payload.products[i].note,
      transaction_id: checkTrans.data.id,
      product_id: payload.products[i].id,
      product_info: JSON.stringify(currProduct)
    })
    transactionObj.total_price += sub_total;

    for (let j = 0; j < currProduct.ingredient.length; j++) {
      let checkIndex = listUsedIngredient.findIndex(d => d.id == currProduct.ingredient[j].id);
      if(checkIndex < 0) {
        listUsedIngredient.push({
          id: currProduct.ingredient[j].id,
          qty: diffQty * currProduct.ingredient[j].tbl_product_ingredient.qty
        })
      } else {
        listUsedIngredient[checkIndex].qty += diffQty * currProduct.ingredient[j].tbl_product_ingredient.qty;
      }
    }
  }

  if(listProductUnavailable.length > 0) {
    return {
      err: {
        data: listProductUnavailable,
        message: 'Some menu unavailable!',
        code: 400
      },
      data: null
    };
  }
  if(listAddonUnavailable.length > 0) {
    return {
      err: {
        data: listAddonUnavailable,
        message: 'Some addon unavailable!',
        code: 400
      },
      data: null
    };
  }

  transactionObj.total_tax = transactionObj.total_price * transactionObj.tax_percentage / 100;
  transactionObj.total_price += transactionObj.total_tax;
  transactionObj.payment_return = transactionObj.total_pay - transactionObj.total_price;

  const deleteTransactionProduct = await model.deleteTransactionProductByTransactionId({ id: checkTrans.data.id });
  if(deleteTransactionProduct.err) {
    return deleteTransactionProduct;
  }

  const updateTransaction = await model.updateTransaction(transactionObj, { id: checkTrans.data.id });
  if(updateTransaction.err) {
    return updateTransaction;
  }

  const insertTransactionProduct = await model.insertTransactionProduct(transactionProductObj);
  if(insertTransactionProduct.err) {
    return insertTransactionProduct;
  }

  //productModel.updateStock(listProductNewStock);
  //ingredientModel.updateStock(listUsedIngredient);

  const result = await model.findOne({ id: checkTrans.data.id })
  if(result.err) {
    return result;
  }

  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;
    return {
      ...d,
      addons: product_info.addons,
      product: d.product ? {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      } : d.product
    }
  })

  return {
    err: null,
    data: result.data
  }  
}

const deleteOrder = async (payload) => {
  const checkTrans = await model.findOne(payload)
  if(checkTrans.err) {
    return checkTrans;
  }

  if(checkTrans.data.status != 'hold') {
    return {
      err: {
        message: 'You can only cancel `hold` transaction!',
        code: 400
      },
      data: null
    };
  }

  let listUsedIngredient = [];
  let listProductNewStock = [];

  for (let i = 0; i < checkTrans.data.transaction_product.length; i++) {
    let checkProductIndex = listProductNewStock.findIndex(d => d.id == checkTrans.data.transaction_product[i].product.id);
    if(checkProductIndex < 0) {
      listProductNewStock.push({
        id: checkTrans.data.transaction_product[i].product.id,
        qty: 0 - checkTrans.data.transaction_product[i].qty
      });
    } else {
      listProductNewStock[checkProductIndex].qty += (0 - checkTrans.data.transaction_product[i].qty);
    }
    for (let j = 0; j < checkTrans.data.transaction_product[i].product.ingredient.length; j++) {
      let checkIngredientIndex = listUsedIngredient.findIndex(d => d.id == checkTrans.data.transaction_product[i].product.ingredient[j].id);
      if(checkIngredientIndex < 0) {
        listUsedIngredient.push({
          id: checkTrans.data.transaction_product[i].product.ingredient[j].id,
          qty: 0 - (checkTrans.data.transaction_product[i].qty * checkTrans.data.transaction_product[i].product.ingredient[j].tbl_product_ingredient.qty)
        })
      } else {
        listUsedIngredient[checkIngredientIndex].qty += (0 - (checkTrans.data.transaction_product[i].qty * checkTrans.data.transaction_product[i].product.ingredient[j].tbl_product_ingredient.qty));
      }
    }
  }

  const deleteTransaction = await model.deleteTransaction(payload);
  if(deleteTransaction.err) {
    return deleteTransaction;
  }

  productModel.updateStock(listProductNewStock);
  ingredientModel.updateStock(listUsedIngredient);

  return {
    err: null,
    data: ''
  }
}

const addProduct = async (payload) => {
  const checkTrans = await model.findOne(payload)
  if(checkTrans.err) {
    return checkTrans;
  }

  if(checkTrans.data.status != 'hold') {
    return {
      err: {
        message: 'You can only add product on `hold` transaction!',
        code: 400
      },
      data: null
    };
  }

  let listProductId = [];
  let listAddonId = [];
  for (let i = 0; i < payload.products.length; i++) {
    listProductId.push(payload.products[i].id);
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      listAddonId.push(payload.products[i].addons[j]);
    }
  }

  const listProduct = await productModel.findMultpileWithIngredient(listProductId);
  if(listProduct.err) {
    return listProduct;
  }

  const listAddon = await addonMenuModel.findMultpile(listAddonId);
  if(listAddon.err) {
    return listAddon;
  }

  const transactionObj = checkTrans.data;

  // substract with tax
  transactionObj.total_price -= transactionObj.total_tax;

  let transactionProductObj = [];
  let listUsedIngredient = [];
  let listProductUnavailable = [];
  let listAddonUnavailable = [];
  let listProductNewStock = [];
  for (let i = 0; i < payload.products.length; i++) {
    
    let currProduct = listProduct.data.find(d => d.id == payload.products[i].id);
    if(!currProduct) {
      listProductUnavailable.push({
        id: payload.products[i].id
      });
      continue;
    }
    currProduct = currProduct.dataValues;
    currProduct.image = config.baseUrl + currProduct.image;

    if(currProduct.stock < payload.products[i].qty) {
      listProductUnavailable.push({
        id: currProduct.id,
        name: currProduct.name
      });
    } else {
      listProductNewStock.push({
        id: currProduct.id,
        qty: payload.products[i].qty
      });
    }

    let sub_total = payload.products[i].qty * currProduct.price;
    if(currProduct.disc > 0) {
    // if(currProduct.disc > 0 && new Date() < new Date(currProduct.exp_date)) {
      let subtract_price = currProduct.disc;
      if(currProduct.is_disc_percentage) {
        subtract_price = currProduct.price * currProduct.disc / 100;
      }
      sub_total -= (payload.products[i].qty * subtract_price);
    }
    
    currProduct.addons = [];
    for (let j = 0; j < payload.products[i].addons.length; j++) {
      let currAddon = listAddon.data.find(d => d.id == payload.products[i].addons[j]);
      if(!currAddon) {
        listAddonUnavailable.push({
          id: payload.products[i].addons[j]
        });
        continue;
      }
      currProduct.addons.push(currAddon);
      sub_total += (payload.products[i].qty * currAddon.price);
    }

    transactionProductObj.push({
      id: uuidv4(),
      qty: payload.products[i].qty,
      sub_total: sub_total,
      note: payload.products[i].note,
      transaction_id: transactionObj.id,
      product_id: payload.products[i].id,
      product_info: JSON.stringify(currProduct)
    })
    transactionObj.total_price += sub_total;

    for (let j = 0; j < currProduct.ingredient.length; j++) {
      listUsedIngredient.push({
        id: currProduct.ingredient[j].id,
        qty: payload.products[i].qty * currProduct.ingredient[j].tbl_product_ingredient.qty
      })
    }
  }

  if(listProductUnavailable.length > 0) {
    return {
      err: {
        data: listProductUnavailable,
        message: 'Some menu unavailable!',
        code: 400
      },
      data: null
    };
  }
  if(listAddonUnavailable.length > 0) {
    return {
      err: {
        data: listAddonUnavailable,
        message: 'Some addon unavailable!',
        code: 400
      },
      data: null
    };
  }

  transactionObj.total_tax = transactionObj.total_price * transactionObj.tax_percentage / 100;
  transactionObj.total_price += transactionObj.total_tax;
  transactionObj.payment_return = transactionObj.total_pay - transactionObj.total_price;

  const insertTransactionProduct = await model.insertTransactionProduct(transactionProductObj);
  if(insertTransactionProduct.err) {
    return insertTransactionProduct;
  }

  const updateTransObj = {
    total_price: transactionObj.total_price,
    total_tax: transactionObj.total_tax,
    payment_return: transactionObj.payment_return
  }
  const updateTrans = await model.updateTransaction(updateTransObj, { id: transactionObj.id });
  if(updateTrans.err) {
    return updateTrans;
  }

  productModel.updateStock(listProductNewStock);
  ingredientModel.updateStock(listUsedIngredient);

  const result = await model.findOne({ id: transactionObj.id })
  if(result.err) {
    return result;
  }

  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;
    return {
      ...d,
      addons: product_info.addons,
      product: {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      }
    }
  })

  return {
    err: null,
    data: result.data
  }
}

const updateProduct = async (payload) => {
  const checkTransProduct = await model.findTransactionProduct(payload)
  if(checkTransProduct.err) {
    return checkTransProduct;
  }

  if(checkTransProduct.data.transaction.status != 'hold') {
    return {
      err: {
        message: 'You can only update `hold` transaction!',
        code: 400
      },
      data: null
    };
  }

  const listAddon = await addonMenuModel.findMultpile(payload.addons);
  if(listAddon.err) {
    return listAddon;
  }

  const transactionObj = checkTransProduct.data.transaction;
  let currProduct = checkTransProduct.data.product;
  currProduct.image = config.baseUrl + currProduct.image;
  let diffQty = payload.qty - checkTransProduct.data.qty;

  let listUsedIngredient = [];
  let listProductUnavailable = [];
  let listAddonUnavailable = [];
  let listProductNewStock = [];

  if(currProduct.stock < diffQty) {
    listProductUnavailable.push({
      id: currProduct.id,
      name: currProduct.name
    });
  } else {
    listProductNewStock.push({
      id: currProduct.id,
      qty: diffQty
    });
  }

  let sub_total = payload.qty * currProduct.price;
  let sub_total_diff = diffQty * currProduct.price;
  if(currProduct.disc > 0) {
  // if(currProduct.disc > 0 && new Date() < new Date(currProduct.exp_date)) {
    let subtract_price = currProduct.disc;
    if(currProduct.is_disc_percentage) {
      subtract_price = currProduct.price * currProduct.disc / 100;
    }
    sub_total -= (payload.qty * subtract_price);
    sub_total_diff -= (diffQty * subtract_price);
  }
  
  currProduct.addons = [];
  for (let j = 0; j < payload.addons.length; j++) {
    let currAddon = listAddon.data.find(d => d.id == payload.addons[j]);
    if(!currAddon) {
      listAddonUnavailable.push({
        id: payload.addons[j]
      });
      continue;
    }
    currProduct.addons.push(currAddon);
    sub_total += (payload.qty * currAddon.price);
    sub_total_diff += (diffQty * currAddon.price);
  }

  // substract with tax
  transactionObj.total_price -= transactionObj.total_tax;
  // new total price
  transactionObj.total_price += sub_total_diff;
  transactionObj.total_tax = transactionObj.total_price * transactionObj.tax_percentage / 100;
  transactionObj.total_price += transactionObj.total_tax;
  transactionObj.payment_return = transactionObj.total_pay - transactionObj.total_price;

  for (let j = 0; j < currProduct.ingredient.length; j++) {
    listUsedIngredient.push({
      id: currProduct.ingredient[j].id,
      qty: diffQty * currProduct.ingredient[j].tbl_product_ingredient.qty
    })
  }

  const updateTransProductObj = {
    qty: payload.qty,
    sub_total: sub_total,
    note: payload.note,
    product_info: JSON.stringify(currProduct)
  }
  const updateTransProduct = await model.updateTransactionProduct(updateTransProductObj, payload);
  if(updateTransProduct.err) {
    return updateTransProduct;
  }

  const updateTransObj = {
    total_price: transactionObj.total_price,
    total_tax: transactionObj.total_tax,
    payment_return: transactionObj.payment_return
  }
  const updateTrans = await model.updateTransaction(updateTransObj, { id: transactionObj.id });
  if(updateTrans.err) {
    return updateTrans;
  }

  productModel.updateStock(listProductNewStock);
  ingredientModel.updateStock(listUsedIngredient);

  const result = await model.findOne({ id: transactionObj.id })
  if(result.err) {
    return result;
  }

  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;
    return {
      ...d,
      addons: product_info.addons,
      product: {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      }
    }
  })

  return {
    err: null,
    data: result.data
  }
}

const deleteProduct = async (payload) => {
  const checkTransProduct = await model.findTransactionProduct(payload)
  if(checkTransProduct.err) {
    return checkTransProduct;
  }

  if(checkTransProduct.data.transaction.status != 'hold') {
    return {
      err: {
        message: 'You can only delete `hold` transaction!',
        code: 400
      },
      data: null
    };
  }

  const transactionObj = checkTransProduct.data.transaction;
  let currProduct = checkTransProduct.data.product;
  let diffQty = 0 - checkTransProduct.data.qty;

  let listUsedIngredient = [];
  let listProductNewStock = [];

  listProductNewStock.push({
    id: currProduct.id,
    qty: diffQty
  });

  // substract with tax
  transactionObj.total_price -= transactionObj.total_tax;
  // new total price
  transactionObj.total_price -= checkTransProduct.data.sub_total;
  transactionObj.total_tax = transactionObj.total_price * transactionObj.tax_percentage / 100;
  transactionObj.total_price += transactionObj.total_tax;
  transactionObj.payment_return = transactionObj.total_pay - transactionObj.total_price;

  for (let j = 0; j < currProduct.ingredient.length; j++) {
    listUsedIngredient.push({
      id: currProduct.ingredient[j].id,
      qty: diffQty * currProduct.ingredient[j].tbl_product_ingredient.qty
    })
  }

  const deleteTransProduct = await model.deleteTransactionProduct(payload);
  if(deleteTransProduct.err) {
    return deleteTransProduct;
  }

  const updateTransObj = {
    total_price: transactionObj.total_price,
    total_tax: transactionObj.total_tax,
    payment_return: transactionObj.payment_return
  }
  const updateTrans = await model.updateTransaction(updateTransObj, { id: transactionObj.id });
  if(updateTrans.err) {
    return updateTrans;
  }

  productModel.updateStock(listProductNewStock);
  ingredientModel.updateStock(listUsedIngredient);

  const result = await model.findOne({ id: transactionObj.id })
  if(result.err) {
    return result;
  }

  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;
    return {
      ...d,
      addons: product_info.addons,
      product: {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      }
    }
  })

  return {
    err: null,
    data: result.data
  }
}

const payOrder = async (payload) => {
  const checkTrans = await model.findOne(payload)
  if(checkTrans.err) {
    return checkTrans;
  }

  if(checkTrans.data.status == 'paid') {
    return {
      err: {
        message: 'You transactions are already paid!',
        code: 400
      },
      data: null
    };
  }

  const transactionObj = checkTrans.data;
  // substract with tax
  transactionObj.total_price -= transactionObj.total_tax;
  // new total price
  transactionObj.total_tax = transactionObj.total_price * payload.tax_order_percentage / 100;
  transactionObj.total_price += transactionObj.total_tax;
  transactionObj.payment_return = payload.total_pay - transactionObj.total_price;

  const updateTransObj = {
    tax_percentage: payload.tax_order_percentage,
    total_price: transactionObj.total_price,
    total_tax: transactionObj.total_tax,
    payment_type: payload.payment_type,
    total_pay: payload.total_pay,
    payment_return: transactionObj.payment_return,
    status: 'paid'
  }
  const updateTrans = await model.updateTransaction(updateTransObj, { id: transactionObj.id });
  if(updateTrans.err) {
    return updateTrans;
  }

  const result = await model.findOne({ id: transactionObj.id })
  if(result.err) {
    return result;
  }

  result.data.transaction_product = result.data.transaction_product.map(d => {
    let product_info = JSON.parse(d.product_info);
    delete d.product_info;
    return {
      ...d,
      addons: product_info.addons,
      product: d.product ? {
        ...d.product,
        image: d.product.image ? config.baseUrl + d.product.image : d.product.image
      } : d.product
    }
  })

  return {
    err: null,
    data: result.data
  }
}

const reportById = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  let total_capital = 0;
  let total_qty = 0;
  result.data.transaction_product = result.data.transaction_product.map(d => {
    d.product = JSON.parse(d.product_info);
    delete d.product_info;

    let capitalOneProduct = 0;
    d.product.ingredient.map(i => {
      capitalOneProduct += i.price * i.tbl_product_ingredient.qty
    });
    total_capital += d.qty * capitalOneProduct;
    total_qty += d.qty;
    return {
      ...d
    }
  })
  result.data.total_capital = total_capital;
  result.data.total_qty = total_qty;
  result.data.profit = result.data.total_price - result.data.total_capital;

  return {
    err: null,
    data: result.data
  }
}

const report = async (payload) => {
  const result = await model.findAll(payload);
  if(result.err) {
    return result;
  }

  result.data = {
    current_page: payload.page,
    page_size: result.data.rows.length < payload.limit ? result.data.rows.length : payload.limit,
    total_page: Math.ceil(result.data.count / payload.limit),
    ...result.data
  }

  return {
    err: null,
    data: result.data
  }
}

const reportSummary = async (payload) => {
  const result = await model.findAllWithDetail(payload);
  if(result.err) {
    return result;
  }

  let gross_income = 0;
  let net_income = 0;
  let total_order = result.data.count;
  let total_qty = 0;
  let total_capital = 0;

  result.data.rows.map(t => {
    t.transaction_product.map(d => {
      d.product = JSON.parse(d.product_info);

      let capitalOneProduct = 0;
      d.product.ingredient.map(i => {
        capitalOneProduct += i.price * i.tbl_product_ingredient.qty 
      });
      total_capital += d.qty * capitalOneProduct;
      total_qty += d.qty;
    })
    gross_income += t.total_price;
  })

  net_income = gross_income - total_capital;

  return {
    err: null,
    data: {
      gross_income,
      net_income,
      total_qty,
      total_order
    }
  }
}

const reportSummaryProduct = async (payload) => {
  const result = await model.findProductTransaction(payload);
  if(result.err) {
    return result;
  }

  const resultObj = [];
  result.data.rows.map(p => {
    let gross_income = 0;
    let net_income = 0;
    let total_qty = 0;
    let total_capital = 0;

    p.transaction_product.map(d => {
      d.product = JSON.parse(d.product_info);

      let capitalOneProduct = 0;
      d.product.ingredient.map(i => {
        capitalOneProduct += i.price * i.tbl_product_ingredient.qty 
      });
      total_qty += d.qty;
      total_capital += d.qty * capitalOneProduct;
      gross_income += d.sub_total;
    })

    net_income = gross_income - total_capital;

    resultObj.push({
      id: p.id,
      name: p.name,
      qty: total_qty,
      total_capital: total_capital,
      gross_income: gross_income,
      net_income: net_income
    })
  })

  return {
    err: null,
    data: resultObj
  }
}

const reportExcel = async (payload) => {
  const rsMerchant = await merchantModel.findOne({ id: payload.merchant_id })
  if(rsMerchant.err) {
    return result;
  }

  const result = await model.findAllWithDetail(payload);
  if(result.err) {
    return result;
  }

  const wb = new excel.Workbook();
  const ws = wb.addWorksheet('Sheet 1');

  ws.cell(1, 1)
    .string('ID Pesanan');
  ws.cell(1, 2)
    .string('Notes');
  ws.cell(1, 3)
    .string('Status Pesanan');
  ws.cell(1, 4)
    .string('Tipe Pesanan');
  ws.cell(1, 5)
    .string('Metode Pembayaran');
  ws.cell(1, 6)
    .string('Total Qty');
  ws.cell(1, 7)
    .string('Tanggal');
  ws.cell(1, 8)
    .string('Total Modal');
  ws.cell(1, 9)
    .string('Total Pajak');
  ws.cell(1, 10)
    .string('Harga Jual');
  ws.cell(1, 11)
    .string('Laba');

  let gross_income = 0;
  let total_qty = 0;
  let total_capital = 0;
  let total_tax = 0;
  result.data.rows.map((t, tIndex) => {
    let subtotal_capital = 0;
    let subtotal_qty = 0;
    t.transaction_product.map(d => {
      d.product = JSON.parse(d.product_info);

      let capitalOneProduct = 0;
      d.product.ingredient.map(i => {
        capitalOneProduct += i.price * i.tbl_product_ingredient.qty
      });
      subtotal_capital += d.qty * capitalOneProduct;
      subtotal_qty += d.qty;
    })
    gross_income += t.total_price;
    total_tax += t.total_tax;
    total_qty += subtotal_qty;
    total_capital += subtotal_capital;
    ws.cell(tIndex+2, 1)
      .string(t.code)
    ws.cell(tIndex+2, 2)
      .string(t.note)
    ws.cell(tIndex+2, 3)
      .string(t.status)
    ws.cell(tIndex+2, 4)
      .string(t.type)
    ws.cell(tIndex+2, 5)
      .string(t.payment_type)
    ws.cell(tIndex+2, 6)
      .number(subtotal_qty)
    ws.cell(tIndex+2, 7)
      .string(moment(t.createdAt).format('YYYY-MM-DD'))
    ws.cell(tIndex+2, 8)
      .number(subtotal_capital);
    ws.cell(tIndex+2, 9)
      .number(t.total_tax)
    ws.cell(tIndex+2, 10)
      .number(t.total_price)
    ws.cell(tIndex+2, 11)
      .number(t.total_price - subtotal_capital)
  })

  ws.cell(result.data.rows.length+3, 9)
    .string('Total Qty');
  ws.cell(result.data.rows.length+3, 11)
    .number(total_qty);
  ws.cell(result.data.rows.length+4, 9)
    .string('Total Modal');
  ws.cell(result.data.rows.length+4, 11)
    .number(total_capital);
  ws.cell(result.data.rows.length+5, 9)
    .string('Total Pajak');
  ws.cell(result.data.rows.length+5, 11)
    .number(total_tax);
  ws.cell(result.data.rows.length+6, 9)
    .string('Total Harga Jual');
  ws.cell(result.data.rows.length+6, 11)
    .number(gross_income);
  ws.cell(result.data.rows.length+7, 9)
    .string('Total Laba');
  ws.cell(result.data.rows.length+7, 11)
    .number(gross_income - total_capital);
  
  let excelName = `${moment(new Date()).format('YYYYMMDDHHmmss')}_${moment(payload.start_date).format('YYYY-MM-DD')}_`;
  excelName += `${moment(payload.end_date).format('YYYY-MM-DD')}_${rsMerchant.data.name}.xlsx`;
  wb.write('./public/files/excel/'+ excelName);

  return {
    err: null,
    data: config.baseUrl + '/files/excel/' + encodeURI(excelName)
  }
}

module.exports = {
  getOrder,
  getOrders,
  create,
  update,
  refund,
  deleteOrder,
  addProduct,
  updateProduct,
  deleteProduct,
  payOrder,
  reportById,
  report,
  reportSummary,
  reportSummaryProduct,
  reportExcel
}