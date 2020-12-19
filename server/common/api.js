const EasyFtp = require('easy-ftp');
const log4js = require('log4js');
let ftp = new EasyFtp();
let logger = log4js.getLogger('EasyFtp');
logger.level = 'info';

const connectTask = async ( opt ) => {
    const {host, port, user, password, remoteSystem} = opt;

    await ftp.connect({
        host: host,
        port: port,
        username: user,
        password: password,
        type : remoteSystem
    });

    return ftp;
};

const getFileTask =  async () => {
    let listRes = await new Promise((resolve, reject) => {
        ftp.lsAll('/', (err, list) => {
            if(err){
                logger.error(err);
                reject(err);
            }
            resolve(list);
        });
    });

    return listRes;
};

const deleteTask = async ( opt ) => {
    return await new Promise((resolve, reject) => {
        ftp.rm(opt.absolutePath, function(err){
            if(err){
                logger.error(err);
                return reject(err);
            }
            
            resolve(true);
        });
    });
};

const uploadFileTask = async (opt) => {
    new Promise((resolve, reject) => {
        ftp.upload(opt.files, (err) => {
            if(err){
                logger.error(err);
                reject(err);
                return;
            }
            
            resolve(true);
        });
    });
};

const uploadDirTask = async (opt) => {
    await new Promise((resolve, reject) => {
        ftp.mkdir(opt.file, (err) => {
            if(err){
                logger.error(err);
                reject(err);
                return;
            }

            resolve(true);
        });
    });
};

module.exports = {
    connectTask, 
    getFileTask, 
    deleteTask, 
    uploadFileTask, 
    uploadDirTask 
};