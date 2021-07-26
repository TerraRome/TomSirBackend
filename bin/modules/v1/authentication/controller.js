const jsonwebtoken = require('jsonwebtoken');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');
const userModel = require('../user/model');
const config = require('../../../configs/config');

const signIn = async (payload) => {
  const checkUser = await userModel.findByEmail(payload)
  if(checkUser.err) {
    return checkUser;
  }

  if(checkUser.data.role !== 'superadmin' && !checkUser.data.merchant.id) {
    return {
      err: { message: 'Akun anda tidak memiliki merchant!', code: 401 },
      data: null
    }
  }

  if(await common.decryptHash(payload.password, checkUser.data.password)) {
    if(checkUser.data.merchant && checkUser.data.merchant.image) {
      checkUser.data.merchant.image = config.baseUrl + checkUser.data.merchant.image;
    }
    const tokenData = {
      id: checkUser.data.id,
      email: checkUser.data.email,
      fullname: checkUser.data.fullname,
      role: checkUser.data.role,
      merchant: checkUser.data.merchant
    };
    const token = await jwtAuth.generateToken(tokenData);
    const refresh_token = await jwtAuth.generateRefreshToken(tokenData);
    const exp_token = jsonwebtoken.decode(token).exp;
    const exp_refresh_token = jsonwebtoken.decode(refresh_token).exp;
    const { id, email, fullname, role, merchant } = checkUser.data;
    const data = { id, email, fullname, role, merchant, token, exp_token, refresh_token, exp_refresh_token };
    return {
      err: null,
      data: data
    }
  }

  return {
    err: { message: 'Email or password is wrong!', code: 401 },
    data: null
  }
}

const refreshToken = async (payload) => {
  const checkRefreshToken = await jwtAuth.verifyRefreshToken(payload);
  if(checkRefreshToken.err) {
    return checkRefreshToken;
  }

  const tokenData = {
    id: checkRefreshToken.data.id,
    email: checkRefreshToken.data.email,
    fullname: checkRefreshToken.data.fullname,
    role: checkRefreshToken.data.role,
    merchant: checkRefreshToken.data.merchant
  };
  const token = await jwtAuth.generateToken(tokenData);
  const refresh_token = await jwtAuth.generateRefreshToken(tokenData);
  const exp_token = jsonwebtoken.decode(token).exp;
  const exp_refresh_token = jsonwebtoken.decode(refresh_token).exp;
  const data = { token, exp_token, refresh_token, exp_refresh_token };
  return {
    err: null,
    data: data
  }
}

module.exports = {
  signIn,
  refreshToken
}