const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.query
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getCustomers);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getCustomers(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get Customers fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get Customers success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.put('/update-profile', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    email: req.decodedToken.email,
    ...req.body
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.updateProfile);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.updateProfile(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Update profile fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update profile success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.body
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.create);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.create(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Create user fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create customer success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;