const fs = require('fs');
const glob = require("glob");
const { connectTask, getFileTask, deleteTask, uploadFileTask, uploadDirTask } = require('./api');

const getGlobInfo = async (opt) => {
    let globRes = await new Promise((resolve, reject) => {
        glob(opt.res, async(err, files) => {
            if (err) {
                return reject(err);
            }
            
            let directorys = files.filter(file => fs.statSync(file).isDirectory());
            
            if (!directorys.length) {
                resolve(files);
            } else {
                let newDirInfo = directorys.map(item => {
                    let filePath = item.split('/');
                    let pathRes = filePath[filePath.length - 1];
                    let curPath = `${opt.path}/${pathRes}`;
            
                    return {
                        file: item,
                        curPath
                    }
                });

                resolve(newDirInfo);
            }
        });
    });

    return globRes;
};

const parseUpload = async (opt) => {
    let files = opt.files.length ? opt.files.map(item => {
        return {
            local: item,
            remote: opt.path
        }
    }) : `${opt.path}${opt.files}`;

    return files;
};

const addFileToOSSSync = async (res, dirPath) => {
    let docs = fs.readdirSync(res);
    
    docs.forEach(async (doc) => {
        let srcPath = res + '/' + doc;
        let fileType = fs.statSync(srcPath);
        
        if(fileType.isFile()){
            parseUpload({
                files: srcPath,
                path: dirPath
            });
        } else if(fileType.isDirectory()){
            await uploadDirTask({
                ftp,
                file: doc,
                path: dirPath
            });

            addFileToOSSSync(srcPath, dirPath);
        }
    });
};

const createFtp = async ( opt ) => {
    let ftp = await connectTask(opt);

    return ftp;
};

const showList =  async () => {
    let listRes = await getFileTask();

    return listRes;
};

const deleteFile = async ( opt ) => {
    await deleteTask(opt);
};

const uploadFtpFile = async (opt) => {
    await uploadFileTask({
        files: opt.files
    });
};

const uploadSftpFile = async (opt) => {
    for (const file of opt.files) {
        uploadFtpFile({
            files: file
        })
    }
};

const UPLOAD_TYPE = {
    ['ftp']: uploadFtpFile,
    ['sftp']: uploadSftpFile
};

// ---------
const uploadFiles = async ( ftp, opt ) => {
    let curGlobInfo = await getGlobInfo({
        res: opt.res
    });
    
    let filesInfo = await parseUpload({
        files: curGlobInfo,
        path: opt.path
    });

    UPLOAD_TYPE[opt.remoteType]({
        files: filesInfo
    });
};

// ---------
const uploadDirectory = async ( opt ) => {
    let data = await getGlobInfo({
        res: opt.res,
        path: opt.path
    });

    await uploadDirTask({
        path: data.curPath
    });
        
    await addFileToOSSSync(data.file, data.curPath);
};

module.exports = {
    createFtp,
    showList,
    deleteFile,
    uploadFiles,
    uploadDirectory
};