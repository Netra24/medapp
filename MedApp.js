const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let mime = require('mime-types')

exports.handler = async (event) => {
    console.log("Request received");

    // Extract file content
    let fileContent = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;

    // Generate file name from current timestamp
    let fileName = `${Date.now()}`;

    // Determine file extension
    let contentType = event.headers['content-type'] || event.headers['Content-Type'];
    let extension = contentType ? mime.extension(contentType) : '';

    let fullFileName = extension ? `${fileName}.${extension}` : fileName;

    try {
        let data = await s3.putObject({
            Bucket: "medicalaudiofiles",
            Key: fullFileName,
            Body: fileContent,
            Metadata: {}
        }).promise();
        return { "message": "Successfully uploaded" };

    } catch (err) {
        return { "message": err };
    };
};