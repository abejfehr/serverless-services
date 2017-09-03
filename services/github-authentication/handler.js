'use strict';

const rp = require('request-promise');

module.exports.callback = (event, context, callback) => {
  let code;
  
  if (!!event.queryStringParameters) {
    code = event.queryStringParameters.code;
  } else {
    code = '3afc13e252e216bdf179';
  }


  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Your GH authentication code is: ${code}`
    }),
  };

  callback(null, response);
};