// const Joi = require('joi');
require('dotenv-flow').config();

const constant = {
    //ENV File
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    EmialId: process.env.EmialId,
    EmialPassword: process.env.EmialPassword,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
    AZURE_KEY:process.env.AZURE_KEY,
    AZURE_CONNECTION_STRING:process.env.AZURE_CONNECTION_STRING,
    AZURE_CONTAINER_URL:process.env.AZURE_CONTAINER_URL,
    AZURE_CONTAINER_BASE_URL:process.env.AZURE_CONTAINER_BASE_URL,
    AZURE_ACCOUNTNAME:process.env.AZURE_ACCOUNTNAME,
    AZURE_CONTAINER_NAME:process.env.AZURE_CONTAINER_NAME,
    AZURE_COURSE_IMG_CONTAINER_NAME:process.env.AZURE_COURSE_IMG_CONTAINER_NAME,
    AZURE_CHAPTER_IMG_CONTAINER_NAME:process.env.AZURE_CHAPTER_IMG_CONTAINER_NAME,
    AZURE_CHAPTER_VIDEO_CAPTION_CONTAINER_NAME:process.env.AZURE_CHAPTER_VIDEO_CAPTION_CONTAINER_NAME,
    MUX_TOKEN_ID:process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET:process.env.MUX_TOKEN_SECRET,
    WEB_BASE_URL:process.env.WEB_BASE_URL,
}
module.exports = constant;