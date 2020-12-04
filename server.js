const Koa = require('koa');
const app = new Koa();
const path = require('path');

//router
const Router = require('koa-router');

//父路由
const router = new Router();

const koaBody = require('koa-body');
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024,    // 设置上传文件大小最大限制200M，默认2M
        onFileBegin: (name, file) => {
            let fileName = file.name.includes('/') ? file.name.split('/')[1] : file.name;
            let filePathArr = file.path.split('\\');

            file.path = `${filePathArr.slice(0, filePathArr.length-1).join('\\')}/${fileName}`;
            file.dir = '/xyx';
        }
    }
}));

//引入子路由
const loginRouter = require('./server/routes/user.js');

//装载子路由
router.use('/api', loginRouter.routes(), loginRouter.allowedMethods());

//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(8888, () => {
    console.log('The server is running at http://localhost:' + 8888);
});

server.setTimeout( 5 * 60 * 1000)