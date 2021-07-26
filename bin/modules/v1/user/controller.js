const { v4: uuidv4 } = require('uuid');
const model = require('./model');
const common = require('../../../helpers/common');
const config = require('../../../configs/config');

const getProfile = async (payload) => {
  const result = await model.findByEmail(payload)
  if(result.err) {
    return result;
  }

  delete result.data.password;
  return {
    err: null,
    data: result.data
  }
}

const updateProfile = async (payload) => {
  const result = await model.findByEmail(payload)
  if(result.err) {
    return result;
  }

  const profileObj = {
    fullname: payload.fullname
  }
  
  const update = await model.updateOne(profileObj, payload);
  if(update.err) {
    return update;
  }

  delete update.data.password;
  return {
    err: null,
    data: update.data
  }
}

const changePassword = async (payload) => {
  const result = await model.findByEmail(payload)
  if(result.err) {
    return result;
  }

  if(await common.decryptHash(payload.old_password, result.data.password)) {
    const userObj = {
      password: await common.generateHash(payload.new_password)
    };

    const update = await model.updateOne(userObj, payload);
    if(update.err) {
      return update;
    }
    
    return {
      err: null,
      data: ''
    }
  }

  return {
    err: { message: 'password is wrong!', code: 401 },
    data: null
  }
}

const getUser = async (payload) => {
  const result = await model.findOne(payload)
  if(result.err) {
    return result;
  }

  result.data.merchant.image = result.data.merchant.image ? config.baseUrl + result.data.merchant.image : result.data.merchant.image;
  delete result.data.password;
  return {
    err: null,
    data: result.data
  }
}

const getUsers = async (payload) => {
  const rsUsers = await model.findAll(payload);
  if(rsUsers.err) {
    return rsUsers;
  }

  rsUsers.data.rows = rsUsers.data.rows.map(d => {
    return {
      ...d,
      merchant: {
        ...d.merchant,
        image: d.merchant.image ? config.baseUrl + d.merchant.image : d.merchant.image
      }
    }
  })

  rsUsers.data = {
    current_page: payload.page,
    page_size: rsUsers.data.rows.length < payload.limit ? rsUsers.data.rows.length : payload.limit,
    total_page: Math.ceil(rsUsers.data.count / payload.limit),
    ...rsUsers.data
  }

  return {
    err: null,
    data: rsUsers.data
  }
}

const create = async (payload) => {
  const result = await model.findByEmail(payload)
  if(result.err) {
    if(result.err.code != 404) {
      return result;
    }

    const userObj = {
      id: uuidv4(),
      email: payload.email,
      fullname: payload.fullname,
      password: await common.generateHash(payload.password),
      role: payload.role,
      merchant_id: payload.merchant_id
    };

    const insert = await model.insertOne(userObj);
    if(insert.err) {
      return insert;
    }
    
    delete insert.data.dataValues.password;
    return {
      err: null,
      data: insert.data
    }
  }

  return {
    err: { message: 'email is already taken!', code: 409 },
    data: null
  }
}

const update = async (payload) => {
  const checkUser = await model.findOne(payload)
  if(checkUser.err) {
    return checkUser;
  }

  if(checkUser.data.email != payload.email) {
    const result = await model.findByEmail(payload)
    if(result.err) {
      if(result.err.code != 404) {
        return result;
      }
    }
    if(!result.err) {
      return {
        err: { message: 'email is already taken!', code: 409 },
        data: null
      }
    }
  }

  const userObj = {
    email: payload.email,
    fullname: payload.fullname,
    role: payload.role,
    merchant_id: payload.merchant_id
  };

  if(payload.password) {
    userObj.password = await common.generateHash(payload.password);
  }

  const update = await model.updateOne(userObj, payload);
  if(update.err) {
    return update;
  }
  
  return {
    err: null,
    data: update.data
  }
}

const deleteOne = async (payload) => {
  const checkData = await model.findOne(payload)
  if(checkData.err) {
    return checkData;
  }

  const deleteOne = await model.deleteOne(payload);
  if(deleteOne.err) {
    return deleteOne;
  }

  return {
    err: null,
    data: deleteOne.data
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUser,
  getUsers,
  create,
  update,
  deleteOne
}