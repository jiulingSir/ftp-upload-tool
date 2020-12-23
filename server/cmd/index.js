const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { createFtp, showList, uploadFiles, uploadDirectory, deleteFile } = require('./api.js');
const logger = require('../../log/index')('cmd-cli');
let path = '/';
let remoteType = '';
logger.level = 'info';

const start = async () => {
    askFtpOrSftp();
}

const askFtpOrSftp = async () => {
    rl.question('Which file system would you like to use? (ftp|sftp) > ', res => {
        if (res == 'ftp' || res == 'sftp') {
            askLoginData(res);
        } else {
            logger.error("Invalid remote system.");
            askFtpOrSftp();
        }
    });
}

const askLoginData = async (remoteSystem) => {
    rl.question('Host? > ', host => {
        rl.question('Port? > ', port => {
            rl.question('User? > ', user => {
                rl.question('Password? (Warning, visible in console) > ', async (password) => {
                    remoteType = remoteSystem;

                    await createFtp({
                        host: host,
                        port: port,
                        user: user,
                        password: password,
                        remoteSystem : remoteSystem
                    });
                    
                    logger.info('Path: /');
                    askAction();
                });
            });
        });
    });
};

const askAction = async () => {
    rl.question('Action? (ls|cd|file|dir|del) > ', (res) => {
        const ACTION_TYPE = {
            ['ls']: ls,
            ['cd']: cd,
            ['file']: uploadFile,
            ['dir']: uploadDir,
            ['del']: del
        };

        if (ACTION_TYPE[res]) {
            return ACTION_TYPE[res]();
        }

        logger.error("UNKNOWN ACTION!");
        askAction();
    });
};

const ls = async () => {
    let data = await showList();
    
    logger.info(data);
    askAction();
};

const cd = async () => {
    rl.question('Path? > ' + path, res => {
      if (res[res.length - 1] != '/') { 
          res += '/'; 
      }

      path += res;
      askAction();
    });
};

const uploadFile = async () => {
    rl.question('RELATIVE (!!) File Destination path? > ' + path, async(res) => {
        await uploadFiles({
            res,
            path
        });

        logger.info('file uploaded.');
        askAction();
    });
};

const uploadDir = async () => {
    rl.question('RELATIVE (!!) Directory Destination path? > ' + path, async (res) => {
        await uploadDirectory({
            res,
            path,
            remoteType
        });

        logger.info('Directory uploaded.');
        askAction();
    });
};

const del = async () => {
    rl.question('File name? > ' + path, async (res) => {
        const absolutePath = path + res;

        await deleteFile({
            absolutePath
        });

        logger.info('delete success.');
        askAction();
    });
};

start();