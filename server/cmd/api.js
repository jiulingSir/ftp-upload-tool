const EasyFtp = require('easy-ftp');
const glob = require('glob');
const Path = require('path');
const logger = require('../../log/index')('server-api');
let ftp = new EasyFtp();

const __uploadFileTask = async ({ files }) => {
    new Promise((resolve, reject) => {
        ftp.upload(files, (err) => {
            if(err){
                logger.error("server error:\n" + err);
                return reject(err);
            }
            
            resolve();
        });
    });
};

const __uploadDirTask = async ({ file }) => {
    await new Promise((resolve, reject) => {
        ftp.mkdir(file, (err) => {
            if(err){
                logger.error("server error:\n" + err);
                return reject(err);
            }

            resolve();
        });
    });
};

const __getGlobInfo = async ({ res }) => {
    let globRes = await new Promise((resolve, reject) => {
        glob(res, async(err, files) => {
            if (err) {
                return reject(err);
            }
        
            resolve(files);
        });
    });

    return globRes;
};

const __parseUpload = async ({ files, path }) => {
    let files = opt.files.map(item => {
        return {
            local: item,
            remote: path
        }
    });

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

const createFtp = async ( {host, port, user, password, remoteSystem} ) => {
    await ftp.connect({
        host: host,
        port: port,
        username: user,
        password: password,
        type : remoteSystem
    });

    logger.info('连接成功');
};

const showList =  async () => {
    let listRes = await new Promise((resolve, reject) => {
        ftp.lsAll('/', (err, list) => {
            if(err){
                logger.error("server error:\n" + err);
                return reject(err);
            }
            resolve(list);
        });
    });

    return listRes;
};

const deleteFile = async ( { absolutePath } ) => {
    await new Promise((resolve, reject) => {
        ftp.rm(absolutePath, function(err){
            if(err){
                logger.error("server error:\n" + err);
                return reject(err);
            }
            
            resolve();
        });
    });
};

const uploadFiles = async ( {res, path} ) => {
    let curGlobInfo = await __getGlobInfo({
        res
    });

    curGlobInfo = curGlobInfo.length ? curGlobInfo : [Path.join(path, res)];
    
    let filesInfo = await __parseUpload({
        files: curGlobInfo,
        path
    });

    __uploadFileTask({
        files: filesInfo
    });
};

const uploadDirectory = async ( {res, path} ) => {
    let data = await __getGlobInfo({
        res,
        path
    });
    
    // let res = await __addFileToOSSSync(data[0], opt.path);
    await __uploadDirTask({
        file: Path.join(path, Path.basename(res))
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