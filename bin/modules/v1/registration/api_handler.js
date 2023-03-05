const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', async (req, res) => {
  const payload = {
    ...req.query
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getRegistration);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return controller.getRegistration(result.data);
  };
  const sendResponse = async (result) => {
    if (result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get registration fail',
        code: result.err.code || 500
      });
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get registration success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/all', async (req, res) => {
  const payload = {
    ...req.query,
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getRegistrations);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return controller.getRegistrations(result.data);
  };
  const sendResponse = async (result) => {
    if (result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get regis fail',
        code: result.err.code || 500
      });
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get regis success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', jwtAuth.verifyToken, jwtAuth.isAdmin, async (req, res) => {
  const payload = {
    ...req.body,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined,
    // createdBy: req.decodedToken.id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.create);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return controller.create(result.data);
  };
  const sendResponse = async (result) => {
    if (result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Create registration fail',
        code: result.err.code || 500
      });
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create registration success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/report/excel', jwtAuth.verifyToken, async (req, res) => {
  const payload = {
    ...req.query,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getRegistrations);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return controller.reportExcel(result.data);
  };
  const sendResponse = async (result) => {
    if (result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Report excel fail',
        code: result.err.code || 500
      });
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Report excel success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;