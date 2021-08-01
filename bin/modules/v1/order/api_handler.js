const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', async(req, res) => {
  const payload = {
    ...req.query,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getOrders);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getOrders(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get orders fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get orders success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.body,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
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
        data: result.err.data || '',
        message: result.err.message || 'Create order fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create order success',
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
        data: result.err.data || '',
        message: result.err.message || 'Update order fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update order success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.put('/refund/:id', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    id: req.params.id,
    ...req.body
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.update);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.refund(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: result.err.data || '',
        message: result.err.message || 'Update order fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update order success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.delete('/:id', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    id: req.params.id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getOrder);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.deleteOrder(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: result.err.data || '',
        message: result.err.message || 'Delete order fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Delete order success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/pay', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.body
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.payOrder);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.payOrder(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: result.err.data || '',
        message: result.err.message || 'Pay order fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Pay order success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/product', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.body
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.addProduct);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.addProduct(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: result.err.data || '',
        message: result.err.message || 'Add order product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Add order product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.put('/product/:transaction_product_id', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.body,
    id: req.params.transaction_product_id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.updateProduct);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.updateProduct(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: result.err.data || '',
        message: result.err.message || 'Update order product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update order product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.delete('/product/:transaction_product_id', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    id: req.params.transaction_product_id
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.deleteProduct);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.deleteProduct(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: result.err.data || '',
        message: result.err.message || 'Delete order product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Delete order product success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/report', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.query,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getOrders);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.report(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get reports fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get reports success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/report/summary', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.query,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.reportSummary);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.reportSummary(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get report summary fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get report summary success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/report/summary/product', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    ...req.query,
    merchant_id: req.decodedToken.merchant ? req.decodedToken.merchant.id || undefined : undefined
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.reportSummary);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.reportSummaryProduct(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get report summary product fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get report summary product success',
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
  const validatePayload = await common.isValidPayload(payload, reqModel.getOrders);
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

router.get('/report/:id', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    id: req.params.id,
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getOrder);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.reportById(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get order fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get order success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/:id', jwtAuth.verifyToken, async(req, res) => {
  const payload = {
    id: req.params.id,
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getOrder);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getOrder(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get order fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get order success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

module.exports = router;