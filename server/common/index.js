const fs = require('fs');
const glob = require("glob");
const { connectTask, getFileTask, deleteTask, uploadFileTask, uploadDirTask } = require('./api');
const path = require('path');

const getGlobInfo = async (opt) => {
    let globRes = await new Promise((resolve, reject) => {
        glob(opt.res, async(err, files) => {
            if (err) {
                return reject(err);
            }
        
            resolve(files);
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

const addFileToOSSSync = async (data, dirPath) => {
    if (!Array.isArray(data)) {
        return;
    }
    
    data.forEach(async (doc) => {
        let fileType = fs.statSync(doc);
        
        if(fileType.isFile()){
            await uploadFtpFile({
                files: [{local: doc, remote: dirPath}]
            });
        } else if(fileType.isDirectory()){
            let data = fs.readdirSync(doc).map(item => {
                return `${doc}/${item}`;
            });

            await uploadDirTask({
                file: `${dirPath}${path.basename(doc)}`
            });
            addFileToOSSSync(data, dirPath);
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
const uploadFiles = async ( opt ) => {
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
    
    await addFileToOSSSync(data, opt.path);
};

module.exports = {
    createFtp,
    showList,
    deleteFile,
    uploadFiles,
    uploadDirectory
};