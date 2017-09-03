'use strict';

const rp = require('request-promise');
const qs = require('querystring');

module.exports.callback = (event, context, callback) => {  
  const form = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: event.queryStringParameters.code,
  }

  rp.post({ url: process.env.URL, form: form }).then((body, response, error) => {
    console.log(`Body: ${body}`);
    
    if (error) {
      console.log(error);
    } else {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: qs.parse(body),
        }),
      };

      callback(null, response);
    }
  });
};