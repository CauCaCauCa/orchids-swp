const enableLogger = true;
const enableInfo = true;
const enableError = true;
const enableWarn = true;
const enableLog = true;

const Logger = {
    info: (message) => {
        enableLogger && enableInfo && console.info(message);
    },

    error: (message) => {
        enableLogger && enableError && console.error(message);
    },

    warn: (message) => {
        enableLogger && enableWarn && console.warn(message);
    },

    log: (message) => {
        enableLogger && enableLog && console.log(message);
    }
}

module.exports = Logger;