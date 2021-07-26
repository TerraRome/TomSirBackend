const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.query,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAddonCategories);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getAddonCategories(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get addon categories fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get addon categories success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/:id', async(req, res) => {
  const payload = {
    id: req.params.id,
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAddonCategory);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getAddonCategory(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get addon category fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get addon category success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    ...req.body,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined,
    createdBy: req.decodedToken.id
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
        message: result.err.message || 'Create addon category fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create addon category success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.put('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
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
        message: result.err.message || 'Update addon category fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update addon category success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.delete('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    id: req.params.id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAddonCategory);
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
        message: result.err.message || 'Delete addon category fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Delete addon category success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;