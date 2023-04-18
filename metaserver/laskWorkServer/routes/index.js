var express = require('express');
var router = express.Router();
const UserController = require('../controllers/web/UserController')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//登录接口
router.post('/webapi/user/login', UserController.login);
// 注册
router.post('/webapi/user/signup', UserController.signup);
// 检查是否重复用户
router.post('/webapi/user/checkRepeat', UserController.checkRepeat);
// 提交订单
router.post('/webapi/user/submitOrder', UserController.submitOrder);
// 查询订单
router.post('/webapi/user/getOrder', UserController.getOrder);
// 查询商品
router.post('/webapi/user/getGoods', UserController.getGoods);
// 输入查询商品
router.post('/webapi/user/searchGood', UserController.searchGood);
module.exports = router;
