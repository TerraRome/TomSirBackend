const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    ...req.query
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAllKas);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getAllKas(result.data);
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

router.post('/', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    ...req.body,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined,
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

router.put('/:id', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    id: req.params.id,
    ...req.body
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.update);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.update(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Update Kas fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update Kas success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.delete('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    id: req.params.id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getKas);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.deleteOne(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Delete Kas fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Delete Kas success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/report/excel', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.query,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAllKas);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.reportExcel(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
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