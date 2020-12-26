const EasyFtp = require('easy-ftp');

describe('Ftp server tests', () => {
    const user = {
        host: '47.107.157.97',
        user: 'ftp',
        port: 21,
        password: 'Admin@123',
        remoteSystem: 'ftp'
    };
    let ftp = new EasyFtp();

    describe('connect server', () => {
        it('should connect server successful with current userInfo', async (done) => {
            let successMockFn = jest.fn();
            ftp.on('open', successMockFn);
            await ftp.connect(user);
            expect(ftp).toBeInstanceOf(EasyFtp);
            done();
        });
        it('should connect failed with error userInfo', async (done) => {
            try {
                await ftp.connect({});
            } catch(e) {
                expect(e.message).toEqual('connect failed');
            };
            done();
        });
    });

    describe('show list', () => {
        it('should return list', async (done) => {
            let successMockFn = jest.fn();

            await ftp.lsAll('', successMockFn());
            expect(successMockFn).toHaveBeenCalled();
            
            done();
        });
    });

    describe('delete file', () => {
        it('should delete successful with specified path', async (done) => {
            let successMockFn = jest.fn();

            await ftp.rm('/xyx/111', successMockFn());
            expect(successMockFn).toHaveBeenCalled();
            
            done();
        });
        it('delete failed with error path', async (done) => {
            try {
                await ftp.rm('xxx');
            } catch(e) {
                expect(e.message).toEqual('xxx no exists');
            };
            
            done();
        });
    });

    describe('mkdir directory', () => {
        it('mkdir directory successful with specified path', async (done) => {
            let successMockFn = jest.fn();

            await ftp.mkdir('/xyx/333', successMockFn());
            expect(successMockFn).toHaveBeenCalled();
            
            done();
        });
    });

    describe('upload file', () => {
        it('upload file successful with specified path', async (done) => {
            let successMockFn = jest.fn();

            await ftp.upload([{
                local: 'C:\\Users\\Administrator\\Desktop\\xyx\\2.jpg', 
                remote: '/xyx'
            }], successMockFn());
            
            expect(successMockFn).toHaveBeenCalled();
            
            done();
        });
        it('upload file with error path', async (done) => {
            try {
                await ftp.upload([{local: 'xxx', remote: '/xyx'}])
            } catch(e) {
                expect(e.message).toEqual('xxx no exists');
            };
            
            done();
        });
    });

});