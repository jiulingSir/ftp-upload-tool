const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: {
        type: "console"
    },
    file: {
        type: 'file',
        filename: 'cheese.log',
        maxLogSize:20480000
    }
  },
  categories: { 
      default: {
        appenders: ['console'], 
        level: 'info' 
      }
    }
});

module.exports = (logName) => {
    return log4js.getLogger(logName || 'console');
};