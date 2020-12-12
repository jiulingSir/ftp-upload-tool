const EasyFtp = require('easy-ftp');
let ftp = new EasyFtp();

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
                reject(err);
            }
    
            resolve(list);
        });
    });

    return listRes;
};

const deleteTask = async ( opt ) => {
    await new Promise((resolve, reject) => {
        ftp.rm(opt.absolutePath, function(err){
            if(err){
                return reject(err);
            }
            resolve();
        });
    });
};

// ---------
// 上传文件任务
const uploadFileTask = async (opt) => {
    return new Promise((resolve, reject) => {
        ftp.upload(opt.files, (err) => {
            if(err){
                reject(err);
                return;
            }
    
            resolve();
        });
    });
};

// ---------
// 上传文件夹任务
const uploadDirTask = async (opt) => {
    await new Promise((resolve, reject) => {
        ftp.mkdir(opt.file, opt.path, (err) => {
            if(err){
                reject(err);
                return;
            }
    
            resolve();
        });
    });
};

ftp.on('error', (err) => {
    console.log("Error while connecting to the " + remoteSystem + " server:", err);
    console.log("Please choose another remote system or other credentials.");
    console.log(" ");

    try{
        ftp.close();
    }catch(e){
        console.log(e);
    }
});

module.exports = {
    connectTask, 
    getFileTask, 
    deleteTask, 
    uploadFileTask, 
    uploadDirTask 
};