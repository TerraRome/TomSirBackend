const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/by-category/:addon_category_id', async(req, res) => {
  const payload = {
    addon_category_id: req.params.addon_category_id,
    ...req.query
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAddonMenusByCategoryId);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getAddonMenusByCategoryId(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get addon menus fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get addon menus success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/:id', async(req, res) => {
  const payload = {
    id: req.params.id,
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAddonMenu);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getAddonMenu(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get addon menu fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get addon menu success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    ...req.body,
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
        message: result.err.message || 'Create addon menu fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create addon menu success',
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
        message: result.err.message || 'Update addon menu fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update addon menu success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.delete('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    id: req.params.id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getAddonMenu);
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
        message: result.err.message || 'Delete addon menu fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Delete addon menu success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;