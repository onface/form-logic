var hashPort = require('hash-to-port')
var iPackgae = require('../package.json')
module.exports = function () {
    return {
        serverPort: hashPort('serverPort' + iPackgae.name),
        livereloadServerPort: hashPort('livereloadServerPort' + iPackgae.name)
    }
}
