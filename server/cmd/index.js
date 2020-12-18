const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const { createFtp, showList, uploadFiles, uploadDirectory, deleteFile } = require('../common/index.js');

let ftp = null;
let path = '/';
let remoteType = '';

const start = async () => {
    askFtpOrSftp();
}

const askFtpOrSftp = async () => {
    rl.question('Which file system would you like to use? (ftp|sftp) > ', res => {
        if (res == 'ftp' || res == 'sftp') {
            askLoginData(res);
        } else {
            console.log("Invalid remote system.");
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

                    ftp = await createFtp({
                        host: host,
                        port: port,
                        user: user,
                        password: password,
                        remoteSystem : remoteSystem
                    });
                    
                    console.log('Path: /');
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

        console.log("UNKNOWN ACTION!");
        askAction();
    });
};

const ls = async () => {
    let data = await showList(ftp);
    
    console.log(data);
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
            path,
            remoteType
        });

        console.log('file uploaded.');
        askAction();
    });
};

const uploadDir = async () => {
    rl.question('RELATIVE (!!) Directory Destination path? > ' + path, async (res) => {
        await uploadDirectory({
            res,
            path
        });
        console.log('Directory uploaded.');
        askAction();
    });
};

const del = async () => {
    rl.question('File name? > ' + path, async (res) => {
        const absolutePath = path + res;

        await deleteFile({
            absolutePath
        });

        console.log('delete success.');
        askAction();
    });
};

start();