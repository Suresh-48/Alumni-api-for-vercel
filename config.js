// import("dotenv").config({ silent: true });

import dotenv from "dotenv";
dotenv.config({ silent: true });

const {
  NODE_ENV,
  NODE_ENVIROMMENT,
  PORT,
  DATABASE,
  AWS_KEY_ID,
  AWS_SECRET_KEY_ACCESS,
  AWS_BUCKET,
  AWS_REGION,
  APP_PLAY_STORE_URL,
  email,
  password,
  IOS_APP_STORE_URL,
  FROM_EMAIL,
  SENDGRID_API_KEY,
} = process.env;

// module.exports = {
//     environment: NODE_ENV || "production",
//     port: PORT,
//     database: DATABASE,
//     databasePassword: DATABASE_PASSWORD,
//     awsRegion: AWS_REGION,
//     awsAccessKeyId: AWS_KEY_ID,
//     awsSecretAccessKey: AWS_SECRET_KEY_ACCESS,
//     awsBucketName: AWS_BUCKET || "",
// }

export const PRODUCTION_ENV = "production";
export const DEVELOPMENT_ENV = "development";

// Environments
export const environments = NODE_ENVIROMMENT || DEVELOPMENT_ENV;

// AWS Settings
export const awsRegion = AWS_REGION || "ap-south-1";
export const awsAccessKeyId = AWS_KEY_ID;
export const awsSecretAccessKey = AWS_SECRET_KEY_ACCESS;
export const awsBucketName = AWS_BUCKET;
export const fromEmail = FROM_EMAIL;
export const sendGridKey = SENDGRID_API_KEY;

// App Play Store Url
export const appPlayStoreUrl = APP_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.back2school";

//Iso App Store Url
export const iosAppStoreUrl = IOS_APP_STORE_URL || "https://apps.apple.com/us/app/alumni/id1581845399";
export const EMAIL = email;
export const PASSWORD = password;
