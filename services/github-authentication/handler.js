'use strict';

const callbackHandler = require('./handlers/CallbackHandler');

module.exports.callback = 
  (event, context, callback) => 
    callbackHandler(event, context, callback);
    