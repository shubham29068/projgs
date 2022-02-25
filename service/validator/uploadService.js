
// const constant = require('../db/constant')
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMemoryStorage });
const azureStorage = require('azure-storage');
// const getStream = require("into-stream");
class UploadService {
    constructor() { }
    azureFileUpload(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = getStream(data.file.buffer);
                const blobService = azureStorage.createBlobService(constant.AZURE_ACCOUNTNAME, constant.AZURE_KEY);
                blobService.createBlockBlobFromStream(data.containerName, `${data.file.originalname}`, stream, data.file.buffer.length, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`${data.containerName}/${data.file.originalname}`)
                    }
                })
            } catch (err) {
                reject(err);
            }
        })
    }
}
module.exports = { upload, UploadService }