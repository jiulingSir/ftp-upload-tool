jest.mock('../server/cmd/api.js');
const { createFtp, showList, deleteFile, uploadFiles, uploadDirectory } = require('../server/cmd/api.js');

describe('test api interface', () => {
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