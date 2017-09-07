'use strict';

const qs = require('querystring');
const rp = require('request-promise');

class Authenticator {
  constructor(dynamo) {
    this.dynamo = dynamo;
  }
  
  getAccessToken(code) {
    return new Promise((resolve, reject) => {
      const form = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
      };

      rp.post({ url: process.env.TOKEN_URL, form: form })
        .then((data) => {
          return resolve(qs.parse(data));
        })
        .catch((error) => {
          return reject(new Error(error));
        })
    });
  }

  getUserData(data) {
    return new Promise((resolve, reject) => {
      const options = {
        uri: process.env.USER_URL,
        qs: {
          access_token: data.access_token,
        },
        headers: {
          'User-Agent': process.env.APPLICATION_NAME,
        },
        json: true,
      };

      rp.get(options)
        .then((user) => {
          return resolve(user);
        })
        .catch((error) => {
          return reject(new Error(error));
        });
    });
  }

  save(user, callback) {
    this.dynamo.put(user, (error) => {
      if (error) {
        callback(new Error(error));
        return;
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify(user.Item)
      };

      callback(null, response);
    });
  }
}

module.exports = Authenticator;