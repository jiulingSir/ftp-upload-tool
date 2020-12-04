## 网页端

#### 功能：
用户输入网站进入localhost:8000/,由于没有登录直接跳转到/login页面，登录完成后自动跳转到主页。
右键点击显示上传文件或者上传文件夹，点击登出能跳到登录页面。

#### 运行命令
```javascript
// 第一步
cnpm i
// 第二步
npm run dev
//第三步
node server.js
```

## 命令行

#### 功能：通过命令行方式实现展示、到达指定路径、上传文件与文件夹、删除等功能。

#### 运行命令
```javascript
npm run cmd
```

#### Commands
- **ls** - 列出当前路径的目录内容
- **cd** - 到达给定的路径
- **file** - 从本地文件系统上传文件到远程服务器
- **dir** - 从本地文件系统上传文件夹到远程服务器
- **del** - 删除远程服务器上相对于当前路径的文件

#### Correct Example
```
npm run cmd
Which file system would you like to use? (ftp|sftp) > ftp
Host? > 47.107.157.97
Port? > 21
User? > ftp
Password? (Warning, visible in console) > Admin@123
Action? (ls|cd|file|dir|del) > dir
RELATIVE (!!) Directory Destination path? > C:\Users\sangfor\AppData\Local\Temp\xyx\222
Directory uploaded.
```
