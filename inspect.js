const debug = require("debug")("turn");

module.exports = label => {
  return value => {
    debug(label, value);
    return value;
  };
};
