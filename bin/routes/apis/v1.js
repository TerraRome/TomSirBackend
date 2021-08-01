const express = require('express');
let router = express.Router();

const authenticationHandler = require('../../modules/v1/authentication/api_handler');
const userHandler = require('../../modules/v1/user/api_handler');
const categoryHandler = require('../../modules/v1/category/api_handler');
const ingredientHandler = require('../../modules/v1/ingredient/api_handler');
const productHandler = require('../../modules/v1/product/api_handler');
const addonCategoryHandler = require('../../modules/v1/addon-category/api_handler');
const addonMenuHandler = require('../../modules/v1/addon-menu/api_handler');
const orderHandler = require('../../modules/v1/order/api_handler');
const merchantHandler = require('../../modules/v1/merchant/api_handler');
const customerHandler = require('../../modules/v1/customer/api_handler');
const registrationHandler = require('../../modules/v1/registration/api_handler');

router.use('/auth', authenticationHandler);
router.use('/user', userHandler);
router.use('/category', categoryHandler);
router.use('/ingredient', ingredientHandler);
router.use('/product', productHandler);
router.use('/addon-category', addonCategoryHandler);
router.use('/addon-menu', addonMenuHandler);
router.use('/order', orderHandler);
router.use('/merchant', merchantHandler);
router.use('/customer', customerHandler);
router.use('/registration', registrationHandler);

module.exports = router;
