const __uploadFileTask = async ({ files }) => {
    return Promise.resolve({
        success: true,
        msg: files
    });
};

const __uploadDirTask = async ({ files }) => {
    return Promise.resolve({
        success: true,
        msg: files
    });
};

const __getGlobInfo = async ({ files }) => {
    return Promise.resolve({
        success: true,
        msg: files
    });
};

const __parseUpload = async ({ files, path }) => {
    return Promise.resolve({
        success: true,
        msg: [files, path]
    });
};

const __addFileToOSSSync = async (data, dirPath) => {
    return Promise.resolve({
        success: true,
        msg: [data, dirPath]
    });
};

const createFtp = () => {
    return Promise.resolve({
        success: true
    });
};

const showList =  async () => {
    return Promise.resolve({
        success: true
    });
};

const deleteFile = async () => {
    return Promise.resolve({
        success: true
    });
};

const uploadFiles = async () => {
    return Promise.resolve({
        success: true
    });
};

const uploadDirectory = async () => {
    return Promise.resolve({
        success: true
    });
};

module.exports = {
    __uploadFileTask,
    __uploadDirTask,
    __getGlobInfo,
    __parseUpload,
    __addFileToOSSSync,
    createFtp,
    showList,
    deleteFile,
    uploadFiles,
    uploadDirectory
};