
const path = require('path');
const { phase, trace } = require(path.resolve(__dirname, 'build/Release/trace.node'));

module.exports = {
    phase,
    trace,
}