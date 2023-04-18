var express = require('express');
const UserController = require('../../controllers/web/UserController')
var UserRouter = express.Router();

/* GET home page. */
// 登录
UserRouter.post('/webapi/user/login', UserController.login);
// 注册
UserRouter.post('/webapi/user/signup', UserController.signup);
module.exports = UserRouter;
