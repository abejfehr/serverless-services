'use strict';

const AWS = require('aws-sdk');
const Authenticator = require('../lib/authenticator');

const dynamo = new AWS.DynamoDB.DocumentClient();
let authenticator = new Authenticator(dynamo);

const callbackHandler = (event, context, callback) => {
  authenticator.getAccessToken(event.queryStringParameters.code)
    .then((token) => {
      authenticator.getUserData(token)
        .then((user) => {
          const timestamp = new Date().getTime();

          const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
              id: user.id,
              username: user.login,
              email: user.email,
              accessToken: token.access_token,
              scope: token.scope.split(','),
              tokenType: token.token_type,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          };

          // authenticator.save(params, callback);
        })
        .catch((error) => {
          callback(error);
        });
    })
    .catch((error) => {
      callback(error);
    })
};

exports = module.exports = callbackHandler;