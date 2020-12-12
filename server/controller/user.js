//用于密码加密
const sha1 = require('sha1');
//createToken
const createToken = require('../token/createToken.js');
const host = '47.107.157.97';
const user = 'ftp';
const password = 'Admin@123';
const EasyFtp = require('easy-ftp');
const { createFtp, showList, uploadFiles, uploadDirectory } = require('../common/index.js');
const glob = require("glob");

let ftp = new EasyFtp();

//登录
const Login = async ( ctx ) => {
    let username = ctx.request.body.username;
    let token = createToken(username);
    let bodyInfo = {
        type: ctx.request.body.type,
        port: ctx.request.body.port,
        host: ctx.request.body.host,
        username: username
    };
    
    await createFtp({
        host: host,
        port: port,
        username: user,
        password: password,
        type : remoteSystem
    });

    config = {
        ...bodyInfo,
        password: sha1(ctx.request.body.password)
    }

    ctx.status = 200;
    ctx.body = {
        success: true,
        ...bodyInfo,
        token
    };
};

const Upload =  async ( ctx ) => {
    let files = ctx.request.files.file;
    
    await uploadFiles(files);
    ctx.status = 200;
    ctx.body = {
        success: true,
        msg: '上传成功',
        uploadRes
    };
};

const UploadDir =  async ( ctx ) => {
    let files = ctx.request.files.file;
    let filePath = files.name.split('/');
    await uploadDirectory({
        path: filePath
    });
    
    ctx.status = 200;
    ctx.body = {
        success: true,
        msg: '上传成功',
        uploadRes
    };
};

const List =  async ( ctx ) => {
    showList(ftp, () => {
        ctx.status = 200;
        ctx.body = {
            success: true,
            listRes: listRes
        };
    });
};

module.exports = {
    Login,
    Upload,
    List,
    UploadDir
};