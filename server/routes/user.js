const UserController = require('../controller/user.js');
const Router = require('koa-router');

const childRouter = new Router();

childRouter.post('/login', UserController.Login);
childRouter.post('/upload', UserController.Upload);
childRouter.post('/uploadDir', UserController.UploadDir);
childRouter.get('/list', UserController.List);

module.exports = childRouter;