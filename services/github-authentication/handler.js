'use strict';

const AWS = require('aws-sdk');
const Authenticator = require('./handlers/authenticationHandler');

const dynamo = new AWS.DynamoDB.DocumentClient();
let authenticator = new Authenticator(dynamo);

module.exports.callback = (event, context, callback) => {
  authenticator.getAccessToken(event.queryStringParameters.code)
    .then((token) => {
      authenticator.getUserData(token)
        .then((user) => {
          const timestamp = new Date().getTime();
          const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
              id: user.id,
              accessToken: token.access_token,
              scope: token.scope.split(','),
              tokenType: token.token_type,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          };

          authenticator.save(params, callback);
        })
        .catch((error) => {
          callback(error);
        });
    })
    .catch((error) => {
      callback(error);
    })
};