const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', async(req, res) => {
  const payload = {
    ...req.query
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getProducts);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getProducts(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get products fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get products success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/scan', async(req, res) => {
  const payload = {
    ...req.query,
  };
  console.log('halo')
  const validatePayload = await common.isValidPayload(payload, reqModel.getBarcode);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getBarcodeProduct(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get barcode product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get barcode product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/:id', async(req, res) => {
  const payload = {
    id: req.params.id,
  };
  console.log('hai')
  const validatePayload = await common.isValidPayload(payload, reqModel.getProduct);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getProduct(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    ...req.body,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined,
    createdBy: req.decodedToken.id,
    image: req.files ? req.files.image : undefined,
    size: req.files ? req.files.image.size : undefined,
    ext: req.files ? req.files.image.name.split('.').pop() : undefined
  };
  payload.addon_categories = payload.addon_categories || '[]';
  payload.ingredients = payload.ingredients || '[]';
  payload.addon_categories = common.safelyParseJSON(payload.addon_categories);
  payload.ingredients = common.safelyParseJSON(payload.ingredients);
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
        message: result.err.message || 'Create product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.put('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    id: req.params.id,
    ...req.body,
    image: req.files ? req.files.image : undefined,
    size: req.files ? req.files.image.size : undefined,
    ext: req.files ? req.files.image.name.split('.').pop() : undefined
  };
  payload.addon_categories = payload.addon_categories || '[]';
  payload.ingredients = payload.ingredients || '[]';
  payload.addon_categories = common.safelyParseJSON(payload.addon_categories);
  payload.ingredients = common.safelyParseJSON(payload.ingredients);
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
        message: result.err.message || 'Update product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.delete('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    id: req.params.id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getProduct);
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
        message: result.err.message || 'Delete product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Delete product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;