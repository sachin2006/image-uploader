
const GoogleCloudStorage = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './gcp-image-uploader-key.json')

const { Storage } = GoogleCloudStorage
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'beaming-inn-245804',
})

const BUCKET_NAME = 'society_images'
const gcbucket = storage.bucket('society_images')

exports.copyFileToGCS = (localFilePath) => {
    //console.log(localFilePath)
    const filePath = path.join(__dirname, '..', localFilePath.path);
    var file = gcbucket.file(localFilePath.filename);
    return gcbucket.upload(filePath)
        .then(() => file.makePublic())
        .then(() => getPublicUrl(localFilePath.filename));
};

/**
   * Get public URL of a file. The file must have public access
   * @param {string} bucketName
   * @param {string} fileName
   * @return {string}
   */
const getPublicUrl = (fileName) => `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
