const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');

router.post('/signin', async(req, res) => {
  const payload = req.body;
  const validatePayload = await common.isValidPayload(payload, reqModel.signIn);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.signIn(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Sign in fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Sign in success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/refresh-token', async(req, res) => {
  const payload = req.body;
  const validatePayload = await common.isValidPayload(payload, reqModel.refreshToken);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.refreshToken(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Refresh token fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Refresh token success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;