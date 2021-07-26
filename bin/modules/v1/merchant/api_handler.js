const router = require('express').Router();
const controller = require('./controller');
const reqModel = require('./request_model');
const common = require('../../../helpers/common');
const jwtAuth = require('../../../helpers/authentication');

router.get('/', jwtAuth.verifyToken, jwtAuth.isSuperAdmin, async(req, res) => {
  const payload = {
    ...req.query
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getMerchants);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getMerchants(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get merchants fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get merchants success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.get('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  const payload = {
    id: req.params.id,
  };
  const validatePayload = await common.isValidPayload(payload, reqModel.getMerchant);
  const postRequest = async (result) => {
    if(result.err) {
      return result;
    }
    return controller.getMerchant(result.data);
  };
  const sendResponse = async (result) => {
    if(result.err) {
      return res.status(result.err.code || 500).json({
        success: false,
        data: '',
        message: result.err.message || 'Get merchant fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Get merchant success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.post('/', jwtAuth.verifyToken, jwtAuth.isSuperAdmin, async(req, res) => {
  const payload = {
    ...req.body,
    image: req.files ? req.files.image : undefined,
    size: req.files ? req.files.image.size : undefined,
    ext: req.files ? req.files.image.name.split('.').pop() : undefined
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
        message: result.err.message || 'Create merchant fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Create merchant success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

router.put('/:id', jwtAuth.verifyToken, jwtAuth.isAdmin, async(req, res) => {
  if(req.decodedToken.role !== 'superadmin' && req.decodedToken.merchant.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      data: '',
      message: 'Access denied!',
      code: 403
    });
  }

  const payload = {
    id: req.params.id,
    ...req.body,
    image: req.files ? req.files.image : undefined,
    size: req.files ? req.files.image.size : undefined,
    ext: req.files ? req.files.image.name.split('.').pop() : undefined
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
        message: result.err.message || 'Update merchant fail',
        code: result.err.code || 500
      }); 
    }
    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Update merchant success',
      code: 200
    });
  };
  sendResponse(await postRequest(validatePayload));
});

// router.delete('/:id', jwtAuth.verifyToken, jwtAuth.isSuperAdmin, async(req, res) => {
//   const payload = {
//     id: req.params.id
//   };
//   const validatePayload = await common.isValidPayload(payload, reqModel.getMerchant);
//   const postRequest = async (result) => {
//     if(result.err) {
//       return result;
//     }
//     return controller.deleteOne(result.data);
//   };
//   const sendResponse = async (result) => {
//     if(result.err) {
//       return res.status(result.err.code || 500).json({
//         success: false,
//         data: '',
//         message: result.err.message || 'Delete merchant fail',
//         code: result.err.code || 500
//       }); 
//     }
//     return res.status(200).json({
//       success: true,
//       data: result.data,
//       message: 'Delete merchant success',
//       code: 200
//     });
//   };
//   sendResponse(await postRequest(validatePayload));
// });

module.exports = router;