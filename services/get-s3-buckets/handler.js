'use strict';

const AWS = require('aws-sdk');
const rp = require('request-promise');

const s3 = new AWS.S3();

module.exports.endpoint = (event, context, callback) => {
  s3.listBuckets({}, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
};
