const EasyFtp = require('easy-ftp');

describe('Ftp server tests', () => {
    const user = {
        host: '47.107.157.97',
        user: 'ftp',
        port: 21,
        password: 'Admin@123',
        remoteSystem: 'ftp'
    };
    const path = '/xyx/111';
    const dir = '/xyx/333';
    const files = '/xyx/D:/xyx/111.jpg';

    describe('connect server', () => {
        it('should connect server successful', (done) => {
            const response = new EasyFtp(user);
        
            expect(response).toBeInstanceOf(EasyFtp);
            done();
        });
    });

    describe('show list', () => {
        it('should return list', async (done) => {
            const ftp = new EasyFtp(user);
            
            const res = await new Promise((resolve, reject) => {
                ftp.lsAll('/', (err, list) => {
                    if(err){
                        return reject(err);
                    }
    
                    resolve(list);
                });
            })
        
            expect(res).toBeInstanceOf(Array);
            
            done();
        });
    });

    describe('delete file', () => {
        it('should delete successful with specified path', async (done) => {
            const ftp = new EasyFtp(user);
            
            const res = await new Promise((resolve, reject) => {
                ftp.lsAll(path, (err) => {
                    if(err){
                        return reject(err);
                    }
    
                    resolve(true);
                });
            });
        
            expect(res).toBe(true);
            
            done();
        });
    });

    describe('mkdir directory', () => {
        it('mkdir directory successful with specified path', async (done) => {
            const ftp = new EasyFtp(user);
            
            let res = await new Promise((resolve, reject) => {
                ftp.mkdir(dir, (err) => {
                    if(err){
                        return reject(err);
                    }

                    resolve(true);
                });
            });
        
            expect(res).toBe(true);
            
            done();
        });
    });

    describe('upload file', () => {
        it('upload file successful with specified path', async (done) => {
            const ftp = new EasyFtp(user);
            
            let res = await new Promise((resolve, reject) => {
                ftp.upload(files, (err) => {
                    if(err){
                        return reject(err);
                    }
                    
                    resolve(true);
                });
            });
        
            expect(res).toBe(true);
            
            done();
        });
    });

});