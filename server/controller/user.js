//用于密码加密
const sha1 = require('sha1');
//createToken
const createToken = require('../token/createToken.js');
const host = '47.107.157.97';
// const port = 21; // or 22 for SFTP
const user = 'ftp';
const password = 'Admin@123';

// global.ftp = {};
// const {FtpFileSystem, LocalFileSystem, SftpFileSystem} = require('ftp-sftp');
// const local = new LocalFileSystem();

// function askLoginData(remoteSystem, port) {
//     const FileSystemClass = remoteSystem === 'ftp' ? FtpFileSystem : SftpFileSystem;
//     console.log(port, user)
//     FileSystemClass.create(host, port, user, password)
//     .then(fileSystem => {
//         ftp = fileSystem;console.log(fileSystem)
//     }).catch(() => {
//       console.log("Please choose another remote system or other credentials.")
//     })
// };

var EasyFtp = require('easy-ftp');

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

    // askLoginData(bodyInfo.type, bodyInfo.port);
    global.ftp = new EasyFtp({
        host: host,
        port: bodyInfo.port,
        username: user,
        password: password,
        type : bodyInfo.type
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
    let uploadRes = await new Promise((resolve, reject) => {
        ftp.upload(files.path, files.dir, function(err, doc){
            if(err){
                reject(err);
            }
            resolve(doc);
        })
    });
    
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
    let uploadRes = await new Promise((resolve, reject) => {
        ftp.mkdir(`${files.dir}/${filePath[0]}`, function(err){
            if(err){
                reject(err);
            }
            ftp.upload(files.path, `${files.dir}/${filePath[0]}`, function(err, doc){
                if(err){
                    reject(err);
                }
                resolve(doc);
            })
        });
    });
    
    ctx.status = 200;
    ctx.body = {
        success: true,
        msg: '上传成功',
        uploadRes
    };
};

const List =  async ( ctx ) => {
    //  await new Promise((resolve, reject) => {
    //     ftp.rm('/xyx/1111.jpg', function(err, list){
    //         if(err){
    //             reject(err);
    //         }
    //         resolve(list);
    //     })
    // });
    // return;

    let listRes = await new Promise((resolve, reject) => {
        ftp.lsAll('/', function(err, list){
            if(err){
                reject(err);
            }
            resolve(list);
        })
    });

    ctx.status = 200;
    ctx.body = {
        success: true,
        listRes: listRes
    };
};

module.exports = {
    Login,
    Upload,
    List,
    UploadDir
};