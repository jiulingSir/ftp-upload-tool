const EasyFtp = require('easy-ftp');
const readline = require('readline');
const fs = require('fs');
const glob = require("glob")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let ftp = null;
let path = '/';

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
                rl.question('Password? (Warning, visible in console) > ', password => {
                    ftp = new EasyFtp({
                        host: host,
                        port: port,
                        username: user,
                        password: password,
                        type : remoteSystem
                    });	

                    console.log('Path: /');
                    askAction();
                    
                    ftp.on('error', (err) => {
                        console.log("Error while connecting to the " + remoteSystem + " server:", err);
                        console.log("Please choose another remote system or other credentials.");
                        console.log(" ");

                        try{
                            ftp1.close();
                        }catch(e){
                            console.log(e);
                        }

                        askFtpOrSftp();
                    })
                });
            });
        });
    });
};

const askAction = async () => {
    rl.question('Action? (ls|cd|file|dir|del) > ', (res) => {
      switch (res) {
          case 'ls':
              ls();
              break;
          case 'cd':
              cd();
              break;
          case 'file':
              uploadFile();
              break;
          case 'dir':
              uploadDir();
              break;
          case 'del':
              del();
              break;
          default:
              console.log("UNKNOWN ACTION!");
              askAction();
              break;
      }
    });
};

const ls = async () => {
    let listRes = await new Promise((resolve, reject) => {
        ftp.lsAll('/', function(err, list){
            if(err){
                reject(err);
            }
            resolve(list);
        })
    });
    console.log(listRes);
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
    rl.question('RELATIVE (!!) File Destination path? > ' + path, res => {
        glob(res, function (er, files) {
            if (er) {
                console.log(er);
                return;
            }
            
            ftp.upload(files, path, (err) => {
                if(err){
                    console.log(err);
                }
    
                console.log('file uploaded.');
                askAction();
            });
        });
    });
};

const addFileToOSSSync = async (res, dirPath) => {
    let docs = fs.readdirSync(res);
    
    docs.forEach(function(doc){
        let srcPath = res + '/' + doc;
        let fileType = fs.statSync(srcPath);
        
        if(fileType.isFile()){
            ftp.upload(srcPath, dirPath);
        } else if(fileType.isDirectory()){
            ftp.mkdir(doc, dirPath);
            addFileToOSSSync(srcPath, dirPath);
        }
    });
}

const uploadDir = async () => {
    rl.question('RELATIVE (!!) Directory Destination path? > ' + path, (res) => {
        glob(res, (er, files) => {
            if (er) {
                console.log(er);
                askAction();
                return;
            }

            files.forEach (file => {
                if (!fs.statSync(file).isDirectory()) {
                    return;
                }

                let filePath = file.split('/');
                let pathRes = filePath[filePath.length - 1];
                let curPath = `${path}/${pathRes}`;
                
                ftp.mkdir(curPath, async (err) => {
                    if(err){
                        console.log(err);
                    }
                    
                    await addFileToOSSSync(file, curPath);
    
                    console.log('Directory uploaded.');
                    askAction();
                });
            })
        });
    });
};

const del = async () => {
    rl.question('File name? > ' + path, res => {
        const absolutePath = path + res;
        ftp.rm(absolutePath, function(err){
            if(err){
                console.log(err);
            }

            console.log('delete success.');
            askAction();
        })
    });
};

start();