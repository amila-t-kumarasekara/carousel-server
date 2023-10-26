const { S3Client } = require("@aws-sdk/client-s3");

// create s3 instance using S3Client 
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // store it in .env file to keep it safe
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY // store it in .env file to keep it safe
    },
    region: process.env.AWS_REGION // this is the region that you select in AWS account
  });
  
module.exports = s3;