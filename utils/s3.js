import AWS from "aws-sdk";
import path from "path";

// Config
import { awsRegion, awsAccessKeyId, awsSecretAccessKey, awsBucketName } from "../config.js";

/**
 * Update AWS config
 */
AWS.config.update({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
});

const s3 = new AWS.S3();

/**
 * Get Public Image Url
 *
 * @param {*} filePath
 * @returns
 */
export function getPublicImagUrl(filePath) {
  return `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/${filePath}`;
}

/**
 * Upload Base64 To File
 *
 * @param base64
 * @param newPath
 * @param callback
 */
export function uploadBase64File(base64, newPath, callback) {
  //const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const params = {
    Bucket: awsBucketName,
    Key: newPath,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/png",
    ACL: "public-read",
  };

  const extension = path.extname(newPath);
  const newFilePath = `${path.dirname(newPath)}/${path.basename(newPath, extension)}${extension}`;

  params.Key = newFilePath;

  s3.putObject(params, (err) => {
    if (err) {
      return callback(err);
    }
    return callback(null, newPath);
  });
}
