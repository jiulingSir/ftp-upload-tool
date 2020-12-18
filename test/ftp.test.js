const { connectTask, getFileTask, deleteTask, uploadFileTask, uploadDirTask } = require('../server/common/api.js');
const EasyFtp = require('easy-ftp');

describe('Ftp functional tests', () => {
    describe('When connect server', () => {
        it('should successfully connect server with encrypted info', async () => {
            const user = {
                host: '47.107.157.97',
                user: 'ftp',
                port: 21,
                password: 'Admin@123',
                remoteSystem: 'ftp'
            };
            const response = await connectTask(user);
        
            expect(response).toBeInstanceOf(EasyFtp);
        });

        it('Should return a validation error when a field is missing', async () => {
            const user = {
                host: '47.107.157.97',
                port: 21,
                password: 'Admin@123',
                remoteSystem: 'ftp'
            };
            const response = await connectTask(user);
            
            expect(response).toEqual({
                code: 400,
                error: 'Bad Request',
                message: 'User validation failed'
            });
        });
    });

    describe('When getting file info', () => {
        it('Should return the all file information', async () => {
            const listRes = await getFileTask();
            
            expect(listRes).toBeInstanceOf(Array);
          });
    });

    describe('When delete file with file path', () => {
        it('Should return success infomation', async () => {
            const pathInfo = {
                absolutePath: '/xyx/1111.jpg'
            };
            const listRes = await deleteTask(pathInfo);
            
            expect(listRes).toBe(true);
        });
    });

    describe('When upload file', () => {
        it('Should return the upload file information', async () => {
            const opt = {
                files: [ { local: 'D:/xyx/111/1111.jpg', remote: '/xyx/' } ]
            };
            const uploadRes = await uploadFileTask(opt);
            
            expect(uploadRes).toBe(true);
        });
    });

    // describe('When upload directrory', () => {
    //     it('Should return the upload directrory information', async () => {
    //         const opt = {
    //             files: [ { local: 'D:/xyx/111/1111.jpg', remote: '/xyx/' } ]
    //         };
    //         const uploadRes = await uploadDirTask(opt);
            
    //         expect(uploadRes).toBe(true);
    //     });
    // });

});