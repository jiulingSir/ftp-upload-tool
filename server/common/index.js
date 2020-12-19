const fs = require('fs');
const glob = require("glob");
const { connectTask, getFileTask, deleteTask, uploadFileTask, uploadDirTask } = require('./api');
const path = require('path');
const { dir } = require('console');
let lists = {
    dirs: [],
    files: []
};

const __getGlobInfo = async (opt) => {
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

const __parseUpload = async (opt) => {
    let files = opt.files.length ? opt.files.map(item => {
        return {
            local: item,
            remote: opt.path
        }
    }) : `${opt.path}${opt.files}`;

    return files;
};

const __addFileToOSSSync = async (data, dirPath) => {
    let arr = fs.readdirSync(data);

	arr.forEach(async (item) => {
		const fullpath = path.join(data, item);
        const statsPath = fs.statSync(fullpath);
        
		if(statsPath.isDirectory()){
            lists.dirs.push(path.join(dirPath, item));
            __addFileToOSSSync(fullpath, dirPath);
		}else{
            lists.files.push([{local: fullpath, remote: dirPath}]);
		}
    });

    return lists;
};

const __uploadFtpFile = async (opt) => {
    await uploadFileTask({
        files: opt.files
    });
};

const __uploadSftpFile = async (opt) => {
    for (const file of opt.files) {
        uploadFtpFile({
            files: file
        })
    }
};

const UPLOAD_TYPE = {
    ['ftp']: __uploadFtpFile,
    ['sftp']: __uploadSftpFile
};

const createFtp = async ( opt ) => {
    await connectTask(opt);
};

const showList =  async () => {
    let listRes = await getFileTask();

    return listRes;
};

const deleteFile = async ( opt ) => {
    await deleteTask(opt);
};

const uploadFiles = async ( opt ) => {
    let curGlobInfo = await __getGlobInfo({
        res: opt.res
    });
    
    let filesInfo = await __parseUpload({
        files: curGlobInfo,
        path: opt.path
    });

    UPLOAD_TYPE[opt.remoteType]({
        files: filesInfo
    });
};

const uploadDirectory = async ( opt ) => {
    let data = await __getGlobInfo({
        res: opt.res,
        path: opt.path
    });
    
    // let res = await __addFileToOSSSync(data[0], opt.path);
    await uploadDirTask({
        file: path.join(opt.path, path.basename(opt.res))
    });
    
    return true;
};

module.exports = {
    createFtp,
    showList,
    deleteFile,
    uploadFiles,
    uploadDirectory
};