const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', async(req, res) => {
  const payload = {
    ...req.query
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getKas);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getKas(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get kas fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get kas success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', async(req, res) => {
  const payload = {
    ...req.body,
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
        message: result.err.message || 'Create kas fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create kas success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;