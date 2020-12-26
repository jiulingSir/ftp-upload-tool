jest.mock('../server/cmd/api.js');
const { __uploadFileTask,
        __uploadDirTask,
        __getGlobInfo,
        __parseUpload,
        __addFileToOSSSync,
        createFtp, 
        showList, 
        deleteFile, 
        uploadFiles, 
        uploadDirectory } = require('../server/cmd/api.js');

describe('test api interface', () => {
    it('__uploadFileTask func is call successful', async (done) => {
        const response = await __uploadFileTask({
            files: '1.jpg'
        });
        expect(response).toEqual({
            success: true,
            msg: '1.jpg'
        });
        done();
    });
    it('__uploadDirTask func is call successful', async (done) => {
        const response = await __uploadDirTask({
            files: '/xyx/333'
        });
        expect(response).toEqual({
            success: true,
            msg: '/xyx/333'
        });
        done();
    });
    it('__getGlobInfo func is call successful', async (done) => {
        const response = await __getGlobInfo({
            files: '1'
        });
        expect(response).toEqual({
            success: true,
            msg: '1'
        });
        done();
    });
    it('__parseUpload func is call successful', async (done) => {
        const response = await __parseUpload({ 
            files: ['2.jpg'],
            path: '/xyx'});
        expect(response).toEqual({
            success: true,
            msg: [['2.jpg'], '/xyx']
        });
        done();
    });
    it('__addFileToOSSSync func is call successful', async (done) => {
        const response = await __addFileToOSSSync(['2.jpg', '3.jpg'], '/xyx');
        expect(response).toEqual({
            success: true,
            msg: [['2.jpg', '3.jpg'], '/xyx']
        });
        done();
    });
    it('createFtp func is call successful', async (done) => {
        const response = await createFtp();
        expect(response).toEqual({
            success: true
        });
        done();
    });

    it('showList func is call succssful', async (done) => {
        const response = await showList();
        expect(response).toEqual({
            success: true
        });
        done();
    });

    it('deleteFile func is call succssful', async (done) => {
        const response = await deleteFile();
        expect(response).toEqual({
            success: true
        });
        done();
    });

    it('uploadFiles func is call succssful', async (done) => {
        const response = await uploadFiles();
        expect(response).toEqual({
            success: true
        });
        done();
    });

    it('uploadDirectory func is call succssful', async (done) => {
        const response = await uploadDirectory();
        expect(response).toEqual({
            success: true
        });
        done();
    })
});